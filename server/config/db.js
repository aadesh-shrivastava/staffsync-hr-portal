const mongoose = require('mongoose');

let isConnected = false;

module.exports = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in environment variables');
    throw new Error('MONGO_URI is not set');
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
};
