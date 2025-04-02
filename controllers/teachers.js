const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

const getAllTeachers = async (req, res) => {
    // #swagger.tags = ["Teachers"]
    try {
        const result = await mongodb.getDatabase().db().collection("teachers").find();
        const teachers = await result.toArray();

        res.setHeader("Content-type", "application/json");
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching teachers", error: err });
    }
};

const getSingleTeacher = async (req, res) => {
    // #swagger.tags = ["Teachers"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to find teacher");
        }

        const teacherId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("teachers").find({ _id: teacherId });
        const teachers = await result.toArray();

        res.setHeader("Content-type", "application/json");
        res.status(200).json(teachers[0]);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the teacher", error: err });
    }
};

const createTeacher = async (req, res) => {
    try {
        const teacher = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            subject: req.body.subject,
            yearsOfExperience: req.body.yearsOfExperience,
            contact: req.body.contact,
            address: req.body.address,
            password: req.body.password // Include the password field
        };

        // Optionally, hash the password before saving
        const hashedPassword = await bcrypt.hash(teacher.password, 10);
        teacher.password = hashedPassword;

        const response = await mongodb.getDatabase().db().collection("teachers").insertOne(teacher);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while inserting the teacher");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the teacher", error: err });
    }
};

const updateTeacher = async (req, res) => {
    // #swagger.tags = ["Teachers"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to update teacher");
        }

        const teacherId = new ObjectId(req.params.id);
        const teacher = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            subject: req.body.subject,
            yearsOfExperience: req.body.yearsOfExperience,
            contact: req.body.contact,
            address: req.body.address,
            password: req.body.password // Include the password field
        };

        // Optionally, hash the password before saving
        if (teacher.password) {
            const hashedPassword = await bcrypt.hash(teacher.password, 10);
            teacher.password = hashedPassword;
        }

        const response = await mongodb.getDatabase().db().collection("teachers").replaceOne({ _id: teacherId }, teacher);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the teacher");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the teacher", error: err });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to delete teacher");
        }

        const teacherId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("teachers").deleteOne({ _id: teacherId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "An error occurred while deleting the teacher");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the teacher", error: err });
    }
};

module.exports = {
    getAllTeachers,
    getSingleTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
