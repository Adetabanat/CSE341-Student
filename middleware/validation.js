const Joi = require('joi');

const studentSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    homeTown: Joi.string().required(),
    class: Joi.string().required(),
    house: Joi.string().required(),
    group: Joi.string().required(),
    parentName: Joi.string().required(),
    parentContact: Joi.string().required()
});

const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

module.exports = validateStudent;
