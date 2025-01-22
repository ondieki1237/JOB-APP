const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    console.log('Attempting to connect with URI:', uri);
    
    if (!uri) {
      throw new Error('MongoDB URI is required');
    }
    
    const conn = await mongoose.connect(uri, {
      dbName: 'blue-collar' // explicitly set database name
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 