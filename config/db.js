const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI is not defined in environment variables!');
        return;
    }
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`Attempting to connect to: ${maskedUri}`);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.log('Server will continue to run, but database features will be unavailable.');
  }
};

module.exports = connectDB;
