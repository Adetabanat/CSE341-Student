const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// 🔹 Helper function to validate ObjectId
const isValidObjectId = (id) => ObjectId.isValid(id) && new ObjectId(id).toString() === id;

// 🟢 Get All Students
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('students').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};

// 🔵 Get a Single Student
const getSingle = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate ObjectId
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        const result = await mongodb.getDatabase().db().collection('students').findOne({ _id: new ObjectId(studentId) });

        if (!result) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
};

// 🔹 Helper function to validate student data
const validateStudentData = (data) => {
    const { firstName, lastName, dateOfBirth, age, email, homeTown, studentClass, house, group, parentName, contact } = data;

    if (!firstName || !lastName || !dateOfBirth || !age || !email || !homeTown || !studentClass || !house || !group || !parentName || !contact) {
        return 'All fields are required';
    }

    if (isNaN(age) || age <= 0) {
        return 'Age must be a positive number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    return null;
};

// 🟠 Create a New Student (POST)
const createStudent = async (req, res) => {
    try {
        const validationError = validateStudentData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = await mongodb.getDatabase().db().collection('students').insertOne(req.body);
        res.status(201).json({ message: 'Student created', id: result.insertedId });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
};

// 🟡 Update a Student (PUT)
const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate ObjectId
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        const validationError = validateStudentData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = await mongodb.getDatabase().db().collection('students').updateOne(
            { _id: new ObjectId(studentId) },
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
};

// 🔴 Delete a Student (DELETE)
const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate ObjectId
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        const result = await mongodb.getDatabase().db().collection('students').deleteOne({ _id: new ObjectId(studentId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
};

// Export all functions
module.exports = { getAll, getSingle, createStudent, updateStudent, deleteStudent };
