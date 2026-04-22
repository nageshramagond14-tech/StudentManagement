const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');
const validate = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all student routes
// This ensures only authenticated users can access student data
router.use(authenticate);

router.post('/', validate, controller.create);
router.get('/', controller.getAll);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);
router.put('/:id', validate, controller.update);
router.delete('/:id', controller.delete);

module.exports = router;