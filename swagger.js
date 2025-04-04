const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "User API",
        description: "User API"
    },
    host: "localhost:3000",  // Adjust this for both users and tasks API
    schemes: ["http"],
    paths: {
        "/users": {
            // Define user-related endpoints here
        },
        "/tasks": {  // Add this for tasks
            // Define task-related endpoints here
        },
    },
}

const outputfile = "./swagger.json";
const endpointfile = ["./routes/index"];

swaggerAutogen(outputfile,endpointfile,doc);