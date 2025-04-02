const router = require('express').Router();
const studentController = require('../controllers/students');
const validation = require("../middleware/validate");
const { isAuthenticated } = require('../middleware/authenticate');


// Define routes
router.get('/',  studentController.getAll);
router.get('/:id', studentController.getSingle);

router.post('/', isAuthenticated, validation.saveStudent,studentController.createStudent);
router.put('/:id', isAuthenticated, validation.saveStudent, studentController.updateStudent);
router.delete('/:id', isAuthenticated, studentController.deleteStudent);

module.exports = router;
