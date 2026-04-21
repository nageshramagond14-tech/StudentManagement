const mongoose = require('mongoose');
require('dotenv').config();

const test = async () => {
    try {
        console.log('Testing connection to MongoDB...');
        console.log('URI:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

test();
