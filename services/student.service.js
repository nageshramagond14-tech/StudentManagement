const Student = require('../models/student.model');

/**
 * @desc    Create a new student
 * @param   {Object} data Student data
 * @returns {Promise<Object>} Created student
 */
const createStudent = async (data) => {
  return await Student.create(data);
};

/**
 * @desc    Get all students with search and pagination
 * @param   {Object} query Query parameters (search, page, limit)
 * @returns {Promise<Array>} List of students
 */
const getAllStudents = async (query) => {
  const { search, page = 1, limit = 5 } = query;
  
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return { students, total, page: parseInt(page), limit: parseInt(limit) };
};

/**
 * @desc    Get dashboard statistics
 * @returns {Promise<Object>} Statistics data
 */
const getStats = async () => {
  const totalStudents = await Student.countDocuments();
  
  const courseDistribution = await Student.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const activeCourses = courseDistribution.length;
  const topCourse = courseDistribution.length > 0 ? courseDistribution[0]._id : 'N/A';

  return {
    totalStudents,
    activeCourses,
    topCourse,
    courseDistribution
  };
};

/**
 * @desc    Get student by ID
 * @param   {String} id Student ID
 * @returns {Promise<Object>} Student object
 */
const getStudentById = async (id) => {
  return await Student.findById(id);
};

/**
 * @desc    Update student by ID
 * @param   {String} id Student ID
 * @param   {Object} data Update data
 * @returns {Promise<Object>} Updated student
 */
const updateStudent = async (id, data) => {
  return await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

/**
 * @desc    Delete student by ID
 * @param   {String} id Student ID
 * @returns {Promise<Object>} Deleted student or null
 */
const deleteStudent = async (id) => {
  return await Student.findByIdAndDelete(id);
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStats
};