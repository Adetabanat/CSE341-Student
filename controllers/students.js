const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllStudents = async (req, res) => {
  try {
    const students = await mongodb.getDatabase().db().collection('students').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const student = await mongodb.getDatabase().db().collection('students').findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(student); // Fixed incorrect variable reference
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      age,
      email,
      homeTown,
      studentClass,
      house,
      group,
      parentName,
      contact,
    } = req.body;

    // Validate required fields
    if (
      !firstName || !lastName || !dateOfBirth || !age || !email ||
      !homeTown || !studentClass || !house || !group || !parentName || !contact
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newStudent = {
      firstName,
      lastName,
      dateOfBirth,
      age,
      email,
      homeTown,
      studentClass,
      house,
      group,
      parentName,
      contact,
    };

    const result = await mongodb.getDatabase().db().collection('students').insertOne(newStudent);
    res.status(201).json({ message: 'Student created', studentId: result.insertedId });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const updatedStudent = req.body;

    const result = await mongodb.getDatabase().db().collection('students').updateOne(
      { _id: studentId },
      { $set: updatedStudent }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('students').deleteOne({ _id: studentId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
