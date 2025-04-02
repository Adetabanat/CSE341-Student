const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Student Record API',
  },
  host: 'cse341-student.onrender.com',
  basePath: "/",
  schemes: ['https'],
  paths: {
    "/students": {
        // Define user-related endpoints here
    },
    "/teachers": {  // Add this for tasks
        // Define task-related endpoints here
    },
  },

}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);