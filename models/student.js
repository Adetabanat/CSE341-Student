const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    homeTown: { type: String, required: true },
    class: { type: String, required: true },
    house: { type: String, required: true },
    group: { type: String, required: true },
    parentName: { type: String, required: true },
    parentContact: { type: String, required: true }
});

module.exports = mongoose.model('Student', StudentSchema);
