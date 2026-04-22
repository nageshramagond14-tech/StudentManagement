const mongoose = require('mongoose');
const Student = require('../models/student.model');

// ═══════════════════════════════════════════════════════════════════
//  HELPER: Validate MongoDB ObjectId
// ═══════════════════════════════════════════════════════════════════

/**
 * WHY validate ObjectId in the service layer?
 *   - If you pass an invalid ID (e.g., "abc") to `findById()`,
 *     Mongoose throws a CastError. While our error middleware
 *     catches it, validating early gives cleaner error messages
 *     and avoids unnecessary database round-trips.
 */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ID format: "${id}". Must be a 24-character hex string.`);
    error.statusCode = 400;
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════════
//  CREATE — Student.create()
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Create a new student record in MongoDB
 * @param   {Object} data - { name, age, course }
 * @returns {Promise<Object>} The newly created student document
 *
 * HOW IT WORKS:
 *   1. `Student.create(data)` is shorthand for `new Student(data).save()`
 *   2. Mongoose runs schema validations (required, min, max, etc.)
 *   3. If validation fails, Mongoose throws a ValidationError
 *   4. Our error middleware catches it and returns a 400 response
 */
const createStudent = async (data) => {
  const student = await Student.create(data);
  return student;
};

// ═══════════════════════════════════════════════════════════════════
//  READ ALL — Student.find() with Pagination & Search
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Get all students with search, pagination, and sorting
 * @param   {Object} query - { search, page, limit }
 * @returns {Promise<Object>} { students, total, page, limit, totalPages }
 *
 * PAGINATION EXPLAINED:
 *   - `skip` = how many documents to skip from the start
 *   - `limit` = max documents to return
 *   - Example: page=2, limit=5 → skip=5, return docs 6–10
 *
 * SEARCH EXPLAINED:
 *   - Uses MongoDB $regex with $options: 'i' (case-insensitive)
 *   - Partial match: searching "joh" matches "John", "Johnson"
 *   - Also searches by course for flexibility
 */
const getAllStudents = async (query) => {
  const { search, page = 1, limit = 5 } = query;

  // ── Build filter object ───────────────────────────────────────
  const filter = {};

  if (search && search.trim()) {
    // Use $or to search across multiple fields
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { name: searchRegex },
      { course: searchRegex },
    ];
  }

  // ── Parse & validate pagination params ────────────────────────
  const pageNum = Math.max(1, parseInt(page) || 1);       // Minimum page = 1
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 5)); // 1–100
  const skip = (pageNum - 1) * limitNum;

  // ── Execute queries in parallel for performance ───────────────
  // WHY Promise.all?
  //   Running count + find sequentially takes ~2x the time.
  //   They're independent queries, so run them simultaneously.
  const [total, students] = await Promise.all([
    Student.countDocuments(filter),
    Student.find(filter)
      .sort({ createdAt: -1 })   // Newest first
      .skip(skip)
      .limit(limitNum)
      .lean(),                    // Returns plain JS objects (faster, less memory)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    students,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  };
};

// ═══════════════════════════════════════════════════════════════════
//  STATS — Aggregation Pipeline
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Get dashboard statistics using MongoDB Aggregation
 * @returns {Promise<Object>} { totalStudents, activeCourses, topCourse, courseDistribution }
 *
 * AGGREGATION EXPLAINED:
 *   - $group: Groups all docs by `course` field and counts each
 *   - $sort: Orders groups by count (descending)
 *   - This is much faster than fetching all docs and counting in JS
 */
const getStats = async () => {
  const totalStudents = await Student.countDocuments();

  const courseDistribution = await Student.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const activeCourses = courseDistribution.length;
  const topCourse = activeCourses > 0 ? courseDistribution[0]._id : 'N/A';

  return {
    totalStudents,
    activeCourses,
    topCourse,
    courseDistribution,
  };
};

// ═══════════════════════════════════════════════════════════════════
//  READ ONE — Student.findById()
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Get a single student by their MongoDB _id
 * @param   {String} id - 24-character hex string
 * @returns {Promise<Object|null>} Student document or null
 *
 * WHY .lean()?
 *   - findById returns a full Mongoose Document with methods like
 *     .save(), .validate(), etc. If you only need to READ data,
 *     .lean() returns a plain JS object — 5–10x faster.
 */
const getStudentById = async (id) => {
  validateObjectId(id);
  return await Student.findById(id).lean();
};

// ═══════════════════════════════════════════════════════════════════
//  UPDATE — Student.findByIdAndUpdate()
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Update a student by their MongoDB _id
 * @param   {String} id - Student ID
 * @param   {Object} data - Fields to update
 * @returns {Promise<Object|null>} Updated student or null
 *
 * OPTIONS EXPLAINED:
 *   - new: true     → Return the UPDATED document (default returns old)
 *   - runValidators  → Re-run schema validations on the new data
 *     WHY? By default, `findByIdAndUpdate` skips validation!
 *     This means you could set age=-5 without this flag.
 */
const updateStudent = async (id, data) => {
  validateObjectId(id);
  return await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// ═══════════════════════════════════════════════════════════════════
//  DELETE — Student.findByIdAndDelete()
// ═══════════════════════════════════════════════════════════════════

/**
 * @desc    Delete a student by their MongoDB _id
 * @param   {String} id - Student ID
 * @returns {Promise<Object|null>} Deleted student or null
 *
 * WHY findByIdAndDelete over deleteOne?
 *   - findByIdAndDelete returns the deleted doc (so we can confirm it existed)
 *   - deleteOne only returns { deletedCount: 1 } — less useful for the API
 */
const deleteStudent = async (id) => {
  validateObjectId(id);
  return await Student.findByIdAndDelete(id);
};

// ═══════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStats,
};