require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const studentRoutes = require('./routes/student.routes');
const morgan = require('morgan');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

app.use(express.json());
app.use(morgan('dev'));
app.use(logger);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/students', studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;