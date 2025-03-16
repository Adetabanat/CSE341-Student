const Student = require('../models/student');
const createError = require('http-errors');

const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        next(createError(500, 'Error retrieving students'));
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return next(createError(404, 'Student not found'));
        res.status(200).json(student);
    } catch (error) {
        next(createError(500, 'Error retrieving student'));
    }
};

const createStudent = async (req, res, next) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: 'Student created', student: newStudent });
    } catch (error) {
        next(createError(500, 'Error creating student'));
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return next(createError(404, 'Student not found'));
        res.status(200).json({ message: 'Student updated', student });
    } catch (error) {
        next(createError(500, 'Error updating student'));
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return next(createError(404, 'Student not found'));
        res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
        next(createError(500, 'Error deleting student'));
    }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
