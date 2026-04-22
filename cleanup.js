const mongoose = require('mongoose');
require('dotenv').config();

const clearBadData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const Student = require('./models/student.model');
    // Drop the collection to start fresh since we changed the schema significantly
    await Student.collection.drop().catch(e => console.log('Collection might not exist or already dropped'));
    console.log('Old student data dropped to resolve schema conflicts.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clearBadData();
