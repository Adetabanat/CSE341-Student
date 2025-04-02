const router = require('express').Router();
const studentController = require('../controllers/students');
const validation = require("../middleware/validate");
const { isAuthenticated } = require('../middleware/authenticate');


// Define routes
router.get('/', isAuthenticated, studentController.getAll);
router.get('/:id', isAuthenticated, studentController.getSingle);

router.post('/', isAuthenticated,studentController.createStudent);
router.put('/:id', isAuthenticated, studentController.updateStudent);
router.delete('/:id', isAuthenticated, studentController.deleteStudent);

module.exports = router;
