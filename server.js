const express = require('express');
const connectDB = require('./config/database');
const studentsRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/students', studentsRoutes);

// Handle 404 Errors
app.use((req, res, next) => {
    next(createError(404, 'Route Not Found'));
});

// Global Error Handler
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
