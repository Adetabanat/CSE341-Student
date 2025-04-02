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
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "An error occurred while fetching students", error: err.message });
    }
};

const getSingle = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "You must provide a valid ID" });
        }

        const studentId = new ObjectId(req.params.id);
        const student = await mongodb.getDatabase().db().collection("students").findOne({ _id: studentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(student);
    } catch (err) {
        console.error("Error fetching student:", err);
        res.status(500).json({ message: "An error occurred while fetching the student", error: err.message });
    }
};

const createStudent = async (req, res) => {
    try {
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password,
            homeTown: req.body.homeTown,
            studentClass: req.body.studentClass,
            house: req.body.house,
            group: req.body.group,
            parentName: req.body.parentName,
            contact: req.body.contact
        };

        const response = await mongodb.getDatabase().db().collection("students").insertOne(student);

        if (response.acknowledged) {
            res.status(201).json({ message: "Student created successfully", studentId: response.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create student" });
        }
    } catch (err) {
        console.error("Error creating student:", err);
        res.status(500).json({ message: "An error occurred while creating the student", error: err.message });
    }
};

const updateStudent = async (req, res) => {
    // #swagger.tags = ["Students"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "You must provide a valid ID" });
        }

        const studentId = new ObjectId(req.params.id);
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password,
            homeTown: req.body.homeTown,
            studentClass: req.body.studentClass,
            house: req.body.house,
            group: req.body.group,
            parentName: req.body.parentName,
            contact: req.body.contact
        };

        const response = await mongodb.getDatabase().db().collection("students").replaceOne({ _id: studentId }, student);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Student updated successfully" });
        } else {
            res.status(404).json({ message: "No student found to update" });
        }
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ message: "An error occurred while updating the student", error: err.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "You must provide a valid ID" });
        }

        const studentId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("students").deleteOne({ _id: studentId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Student deleted successfully" });
        } else {
            res.status(404).json({ message: "No student found to delete" });
        }
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ message: "An error occurred while deleting the student", error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createStudent,
    updateStudent,
    deleteStudent
};
