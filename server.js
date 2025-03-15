<<<<<<< HEAD
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
=======
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
>>>>>>> 193e626e71e949146966be7a118343b757cf41ce
})