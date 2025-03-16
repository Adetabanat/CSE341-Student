const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// 🟢 Get All Students
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('students').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

// 🔵 Get a Single Student
const getSingle = async (req, res) => {
    try {
        const studentId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('students').findOne({ _id: studentId });

        if (!result) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error });
    }
};

// 🟠 Create a New Student (POST)
const createStudent = async (req, res) => {
    try {
        const {
            firstName, lastName, dateOfBirth, age, email,
            homeTown, studentClass, house, group, parentName, contact
        } = req.body;

        if (!firstName || !lastName || !dateOfBirth || !age || !email ||
            !homeTown || !studentClass || !house || !group || !parentName || !contact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newStudent = {
            firstName, lastName, dateOfBirth, age, email,
            homeTown, studentClass, house, group, parentName, contact
        };

        const result = await mongodb.getDatabase().db().collection('students').insertOne(newStudent);
        res.status(201).json({ message: 'Student created', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error });
    }
};

// 🟡 Update a Student (PUT)
const updateStudent = async (req, res) => {
    try {
        const studentId = new ObjectId(req.params.id);
        const {
            firstName, lastName, dateOfBirth, age, email,
            homeTown, studentClass, house, group, parentName, contact
        } = req.body;

        if (!firstName || !lastName || !dateOfBirth || !age || !email ||
            !homeTown || !studentClass || !house || !group || !parentName || !contact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedStudent = {
            firstName, lastName, dateOfBirth, age, email,
            homeTown, studentClass, house, group, parentName, contact
        };

        const result = await mongodb.getDatabase().db().collection('students').updateOne(
            { _id: studentId },
            { $set: updatedStudent }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
};

// 🔴 Delete a Student (DELETE)
const deleteStudent = async (req, res) => {
    try {
        const studentId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('students').deleteOne({ _id: studentId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};

module.exports = { getAll, getSingle, createStudent, updateStudent, deleteStudent };
