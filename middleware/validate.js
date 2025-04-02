const validator = require('../helpers/validate');
const saveStudent = async (req, res, next) => {
    const validationRule = {
        "firstName": "required|string",
        "lastName": "required|string",
        "password": "required|string|min:6",
        "email": "required|string|email"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
};



const saveTeacher = async (req, res, next) => {
    const validationRule = {
        "title": "required|string",
        "description": "required|string",
        "dueDate": "required|string",  
        "progress": "required|string",
        "instructor": "required|string",
        "subject": "required|string"  
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(400)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send({
            success: false,
            message: 'Server error during validation',
            error: err
        });
    });
};


module.exports = {
    saveStudent,
    saveTeacher
};