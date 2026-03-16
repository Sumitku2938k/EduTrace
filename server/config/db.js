const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.warn('MONGO_URI is not defined in environment variables.');
      return;
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully ✅');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

