const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const result = await mongodb.getDatabase().db().collection("tasks").find();
        const tasks = await result.toArray();
        res.setHeader("Content-type", "application/json");
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the tasks", error: err });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const userId = new ObjectId(req.params.userId);
        const taskId = new ObjectId(req.params.taskId);
        const result = await mongodb.getDatabase().db().collection("tasks").findOne({ userId, _id: taskId });

        if (!result) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.setHeader("Content-type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the task", error: err });
    }
};

const createTask = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const userId = new ObjectId(req.params.userId);
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            progress: req.body.progress,
            instructor: req.body.instructor,
            subject: req.body.subject,
            userId: userId
        };

        const response = await mongodb.getDatabase().db().collection("tasks").insertOne(task);

        if (response.acknowledged) {
            res.status(201).json({ message: "Task created successfully", taskId: response.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create the task" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the task", error: err });
    }
};

const updateTask = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const taskId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.params.userId);

        const updatedTask = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            progress: req.body.progress,
            instructor: req.body.instructor,
            subject: req.body.subject,
            userId: userId
        };

        const response = await mongodb.getDatabase().db().collection("tasks").replaceOne({ _id: taskId, userId: userId }, updatedTask);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Task updated successfully" });
        } else {
            res.status(404).json({ message: "No task found to update" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the task", error: err });
    }
};

const deleteTask = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const taskId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.params.userId);

        const response = await mongodb.getDatabase().db().collection("tasks").deleteOne({ _id: taskId, userId: userId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ message: "No task found to delete" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the task", error: err });
    }
};

module.exports = {
    getAll,
    getSingle,
    createTask,
    updateTask,
    deleteTask
};
