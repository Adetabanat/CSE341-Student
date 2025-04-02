const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Student Record API',
  },
  host: 'localhost:8080',
  basePath: "/",
  schemes: ['http'],
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