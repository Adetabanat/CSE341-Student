
const mongodb = require("../data/database");
const ObjectId =  require("mongodb").ObjectId;


const getAll = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("tasks").find({ userId: userId });
        const tasks = await result.toArray();
        res.setHeader("Content-type", "application/json");
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the user", error: err });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        const userId = new ObjectId(req.params.userId);
        const tasksId = new ObjectId(req.params.taskId);
        const result = await mongodb.getDatabase().db().collection("tasks").find({userId: userId,  _id: tasksId });
        const tasks = await result.toArray();

        res.setHeader("Content-type", "application/json");
        res.status(200).json(tasks[0]);
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
        
        if (response.acknowledged > 0) {
            res.status(204).json({ message: "Task created successfully", taskId: response.insertedId });
        } else {
            res.status(500).json(response.error || "Some error occurred while creating a new task");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the task", error: err });
    }
};


const updateTask = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to update task");
        }

        const userId = new ObjectId(req.params.userId);
        const taskid = new ObjectId(req.params.id);
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            progress: req.body.progress,
            instructor: req.body.instructor,
            subject: req.body.subject,
            userId: userId
        };

        const response = await mongodb.getDatabase().db().collection("tasks").replaceOne({ userId: userId, _id: taskid }, task);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating task");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the task", error: err });
    }
};


const deleteTask = async (req, res) => {
    // #swagger.tags = ["Tasks"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to delete task");
        }

        const userId = new ObjectId(req.params.userId);
        const taskId = new ObjectId(req.params.id);

        const response = await mongodb.getDatabase().db().collection("tasks").deleteOne({ userId: userId, _id: taskId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "An error occurred while deleting the task");
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