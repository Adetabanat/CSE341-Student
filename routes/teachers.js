const router = require('express').Router();
const teachersController = require('../controllers/teachers'); // Ensure the correct path
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', isAuthenticated, teachersController.getAllTeachers);
router.get('/:id',isAuthenticated, teachersController.getSingleTeacher);
router.post('/', isAuthenticated, teachersController.createTeacher);
router.put('/:id',isAuthenticated,  teachersController.updateTeacher);
router.delete('/:id', isAuthenticated, teachersController.deleteTeacher);

module.exports = router;
