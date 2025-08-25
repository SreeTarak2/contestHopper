const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  try {
    const mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const DB_NAME = process.env.DB_NAME || 'contestHopper';

    const client = new MongoClient(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    console.log('✅ MongoDB connected');

    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('🔴 MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('MongoDB not connected yet. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };