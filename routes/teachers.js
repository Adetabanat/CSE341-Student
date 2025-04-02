const router = require('express').Router();
const teachersController = require('../controllers/teachers');
const validation = require("../middleware/validate");// Ensure the correct path
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', teachersController.getAllTeachers);
router.get('/:id', teachersController.getSingleTeacher);
router.post('/', isAuthenticated, validation.saveTeacher,teachersController.createTeacher);
router.put('/:id',isAuthenticated,  validation.saveTeacher,teachersController.updateTeacher);
router.delete('/:id', isAuthenticated, teachersController.deleteTeacher);

module.exports = router;
