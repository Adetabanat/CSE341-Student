const router = require("express").Router();


const taskController = require("../controllers/tasks");
const validation = require("../middleware/validate")
const {isAuthenticated} = require("../middleware/authenticate");

router.get("/:id", taskController.getAll);

router.get("/:userId/:taskId", taskController.getSingle);

router.post("/:userId",isAuthenticated, validation.saveTask, taskController.createTask);

router.put("/:userId/:id", isAuthenticated, validation.saveTask,  taskController.updateTask);

router.delete("/:userId/:id", isAuthenticated,  taskController.deleteTask);

module.exports = router;