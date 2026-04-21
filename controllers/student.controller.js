const service = require('../services/student.service');

/**
 * @desc    Create student
 * @route   POST /api/students
 */
exports.create = async (req, res, next) => {
  try {
    const data = await service.createStudent(req.body);

    res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 */
exports.getAll = async (req, res, next) => {
  try {
    const result = await service.getAllStudents(req.query);

    res.status(200).json({
      success: true,
      data: result.students,
      total: result.total,
      page: result.page,
      limit: result.limit
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/students/stats
 */
exports.getStats = async (req, res, next) => {
  try {
    const data = await service.getStats();

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await service.getStudentById(req.params.id);

    if (!data) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 */
exports.update = async (req, res, next) => {
  try {
    const data = await service.updateStudent(req.params.id, req.body);

    if (!data) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await service.deleteStudent(req.params.id);

    if (!data) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};