const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const dotenv = require('dotenv');


const port = process.env.PORT || 8080;

app.use(bodyParser.json()); 

app.use('students', require('./routes/students'));

mongodb.iniDb = ((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`connnected to a  Database and Listing on port ${port}`);
        }
        )
    }
})