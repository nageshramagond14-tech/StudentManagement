require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const studentRoutes = require('./routes/student.routes');
const authRoutes = require('./routes/auth.routes');
const morgan = require('morgan');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(logger);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;