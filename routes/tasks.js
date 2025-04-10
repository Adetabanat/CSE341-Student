const router = require("express").Router();


const taskController = require("../controllers/tasks");
const validation = require("../middleware/validate")
const {isAuthenticated} = require("../middleware/authenticate");

router.get("/", taskController.getAll);

router.get("/taskId", isAuthenticated, validation.saveTask, taskController.getSingle);

router.post("/:userId",isAuthenticated, validation.saveTask, taskController.createTask);

router.put("/:userId/:id", isAuthenticated, validation.saveTask,  taskController.updateTask);

router.delete("/:userId/:id", isAuthenticated,  taskController.deleteTask);

module.exports = router;