const mongoose = require('mongoose');

/**
 * Student Schema
 *
 * WHY these validations?
 *   - Mongoose validations are the LAST line of defense before data
 *     hits MongoDB. The validation middleware catches obvious issues
 *     early, but schema validations catch edge cases (e.g., empty
 *     strings that pass the `!name` check, or negative ages).
 *
 * WHY `timestamps: true`?
 *   - Automatically adds `createdAt` and `updatedAt` fields.
 *   - No need to manage these manually — Mongoose handles them.
 *
 * WHY `versionKey: false`?
 *   - Removes the `__v` field from documents. It's used internally
 *     by Mongoose for optimistic concurrency but clutters API
 *     responses for simple CRUD apps.
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,                            // Remove leading/trailing spaces
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    age: {
      type: Number,
      required: [true, 'Student age is required'],
      min: [3, 'Age must be at least 3'],    // Minimum school age
      max: [120, 'Age cannot exceed 120'],   // Reasonable upper bound
    },

    course: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      minlength: [2, 'Course must be at least 2 characters'],
      maxlength: [100, 'Course cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
  },
  {
    timestamps: true,   // Adds createdAt + updatedAt automatically
    versionKey: false,  // Removes __v field from documents
  }
);

/**
 * Index on `name` for faster search queries.
 *
 * WHY?
 *   - The search feature uses regex on `name`. Without an index,
 *     MongoDB does a full collection scan (slow on large data).
 *   - A text index or regular index on `name` improves performance.
 */
studentSchema.index({ name: 1 });
studentSchema.index({ course: 1 });

module.exports = mongoose.model('Student', studentSchema);