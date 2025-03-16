const express = require('express');
const router = express.Router();
const studentController = require('../controllers/students');
const validateStudent = require('../middleware/validation');

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', validateStudent, studentController.createStudent);
router.put('/:id', validateStudent, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
