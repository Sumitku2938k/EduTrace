const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
    try {
        if (!dbURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB successfully ✅');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
module.exports = connectDB;
