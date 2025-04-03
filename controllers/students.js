const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        const result = await mongodb.getDatabase().db().collection("students").find();
        const students = await result.toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching students", error: err });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const studentId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("students").find({ _id: studentId });
        const users = await result.toArray();

      
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the student", error: err });
    }
};

const createStudent = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {

        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            email: req.body.email,
            password: hashedPassword,
            homeTown: req.body.homeTown,
            studentClass: req.body.studentClass,
            house: req.body.house,
            group: req.body.group,
            parentName: req.body.parentName,
            contact: req.body.contact,
        };

        const response = await mongodb.getDatabase().db().collection("students").insertOne(student);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while inserting the user");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the user", error: err });
    }
};

const updateStudent = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const studentId = new ObjectId(req.params.id);
    
        const updatedStudent = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            email: req.body.email,
            password: hashedPassword,
            homeTown: req.body.homeTown,
            studentClass: req.body.studentClass,
            house: req.body.house,
            group: req.body.group,
            parentName: req.body.parentName,
            contact: req.body.contact,
        };

        const response = await mongodb.getDatabase().db().collection("students").replaceOne({ _id: studentId }, updatedStudent);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Student updated successfully" });
        } else {
            res.status(404).json({ message: "Student not found or no changes made" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the student", error: err });
    }
};

const deleteStudent = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const studentId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("students").deleteOne({ _id: studentId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "An error occurred while deleting the user");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the user", error: err });
    }
};

module.exports = {
    getAll,
    getSingle,
    createStudent,
    updateStudent,
    deleteStudent,
};
