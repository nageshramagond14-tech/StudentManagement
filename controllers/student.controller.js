/**
 * Student Controller
 *
 * CLEAN ARCHITECTURE PRINCIPLE:
 *   Controllers are THIN — they only:
 *     1. Extract data from the request (req.body, req.params, req.query)
 *     2. Call the appropriate service function
 *     3. Send the response back to the client
 *
 *   Controllers should NEVER contain business logic or database calls.
 *   All logic lives in the SERVICE layer.
 *
 *   WHY try-catch + next(err)?
 *     - Express doesn't automatically catch errors in async functions.
 *     - Wrapping in try-catch and calling `next(err)` sends the error
 *       to our global error handler middleware.
 */

const service = require('../services/student.service');

// ─────────────────────────────────────────────────────────────────
//  CREATE — POST /api/students
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
exports.create = async (req, res, next) => {
  try {
    const student = await service.createStudent(req.body);

    // 201 = "Created" — use this instead of 200 for resource creation
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────
//  READ ALL — GET /api/students
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Get all students (with pagination & search)
 * @route   GET /api/students?page=1&limit=5&search=John
 * @access  Public
 */
exports.getAll = async (req, res, next) => {
  try {
    const result = await service.getAllStudents(req.query);

    res.status(200).json({
      success: true,
      data: result.students,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────
//  STATS — GET /api/students/stats
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/students/stats
 * @access  Public
 */
exports.getStats = async (req, res, next) => {
  try {
    const data = await service.getStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────
//  READ ONE — GET /api/students/:id
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
exports.getById = async (req, res, next) => {
  try {
    const student = await service.getStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────
//  UPDATE — PUT /api/students/:id
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Update student by ID
 * @route   PUT /api/students/:id
 * @access  Public
 */
exports.update = async (req, res, next) => {
  try {
    const student = await service.updateStudent(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────
//  DELETE — DELETE /api/students/:id
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Delete student by ID
 * @route   DELETE /api/students/:id
 * @access  Public
 */
exports.delete = async (req, res, next) => {
  try {
    const student = await service.deleteStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student,
    });
  } catch (err) {
    next(err);
  }
};