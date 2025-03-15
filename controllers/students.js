const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllStudents = async (req, res) => {
  try {
    const students = await mongodb.getDatabase().collection('students').find().toArray();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const student = await mongodb.getDatabase().collection('students').findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
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
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !age ||
      !email ||
      !homeTown ||
      !studentClass ||
      !house ||
      !group ||
      !parentName ||
      !contact
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

    const result = await mongodb.getDatabase().collection('students').insertOne(newStudent);
    res.status(201).json({ message: 'Student created', studentId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const updatedStudent = req.body;

    const result = await mongodb.getDatabase().collection('students').updateOne(
      { _id: studentId },
      { $set: updatedStudent }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('students').deleteOne({ _id: studentId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
