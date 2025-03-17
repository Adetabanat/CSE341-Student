const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// 🔹 Helper function to validate ObjectId
const isValidObjectId = (id) => ObjectId.isValid(id) && new ObjectId(id).toString() === id;

// 🔹 Helper function to validate teacher data
const validateTeacherData = (data) => {
    const { firstName, lastName, email, subject, yearsOfExperience } = data;

    if (!firstName || !lastName || !email || !subject || yearsOfExperience === undefined) {
        return 'All fields are required';
    }

    if (isNaN(yearsOfExperience) || yearsOfExperience < 0) {
        return 'Years of experience must be a non-negative number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    return null;
};

// 🟢 Get All Teachers
const getAllTeachers = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('teachers').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
};

// 🔵 Get a Single Teacher
const getSingleTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;

        if (!isValidObjectId(teacherId)) {
            return res.status(400).json({ message: 'Invalid teacher ID format' });
        }

        const result = await mongodb.getDatabase().db().collection('teachers').findOne({ _id: new ObjectId(teacherId) });

        if (!result) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: 'Error fetching teacher', error: error.message });
    }
};

// 🟠 Create a New Teacher
const createTeacher = async (req, res) => {
    try {
        const validationError = validateTeacherData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = await mongodb.getDatabase().db().collection('teachers').insertOne(req.body);
        res.status(201).json({ message: 'Teacher created', id: result.insertedId });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: 'Error creating teacher', error: error.message });
    }
};

// 🟡 Update a Teacher
const updateTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;

        if (!isValidObjectId(teacherId)) {
            return res.status(400).json({ message: 'Invalid teacher ID format' });
        }

        const validationError = validateTeacherData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const result = await mongodb.getDatabase().db().collection('teachers').updateOne(
            { _id: new ObjectId(teacherId) },
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: 'Error updating teacher', error: error.message });
    }
};

// 🔴 Delete a Teacher
const deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;

        if (!isValidObjectId(teacherId)) {
            return res.status(400).json({ message: 'Invalid teacher ID format' });
        }

        const result = await mongodb.getDatabase().db().collection('teachers').deleteOne({ _id: new ObjectId(teacherId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: 'Error deleting teacher', error: error.message });
    }
};

// Export functions
module.exports = { getAllTeachers, getSingleTeacher, createTeacher, updateTeacher, deleteTeacher };
