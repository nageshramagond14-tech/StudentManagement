const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Student age is required'],
    min: [1, 'Age must be at least 1']
  },
  course: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Student', studentSchema);