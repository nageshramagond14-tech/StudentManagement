const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema
 *
 * WHY these validations?
 *   - Email: Must be unique, valid format, and normalized to lowercase
 *   - Password: Minimum 6 characters for security, will be hashed before saving
 *   - Name: Required for user identification
 *
 * WHY password hashing?
 *   - NEVER store plain text passwords - this is a critical security principle
 *   - Hashing is a one-way function that converts passwords into secure strings
 *   - Even if database is compromised, attackers cannot reverse the hash to get passwords
 *   - bcrypt automatically handles salt generation for each password
 *
 * WHAT is hashing vs encryption?
 *   - Hashing: One-way function (password -> hash), cannot be reversed
 *   - Encryption: Two-way function (data -> encrypted data -> original data), can be decrypted
 *   - For passwords, we use hashing because we never need to "decrypt" them
 *
 * WHY pre-save hook?
 *   - Automatically hash password before saving to database
 *   - Works for both create and update operations
 *   - Only hashes if password is modified (prevents re-hashing on login attempts)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in queries by default
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,   // Adds createdAt + updatedAt automatically
    versionKey: false,  // Removes __v field from documents
  }
);

// Email index is already defined in the schema with unique: true

/**
 * Pre-save hook to hash password before saving
 * 
 * This middleware runs before any save operation on a User document.
 * It automatically hashes the password if it's been modified.
 */
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  // Hash password with cost factor of 12 (good balance of security vs performance)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare password for login
 * 
 * @param {string} candidatePassword - The password to check
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

/**
 * Instance method to get user data without sensitive information
 * 
 * @returns {Object} - User object without password
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
