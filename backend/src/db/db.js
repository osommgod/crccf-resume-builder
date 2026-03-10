const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    
    // Initialize deployment timestamp on server startup
    await initializeDeploymentTimestamp();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Initialize deployment timestamp in config collection
 */
const initializeDeploymentTimestamp = async () => {
  const Config = require('../models/Config');
  
  try {
    const existingConfig = await Config.findOne({ key: 'DEPLOYMENT_TIMESTAMP' });
    
    if (!existingConfig) {
      await Config.create({
        key: 'DEPLOYMENT_TIMESTAMP',
        value: new Date().toISOString()
      });
      console.log('✅ Deployment timestamp initialized');
    } else {
      console.log('✅ Deployment timestamp already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing deployment timestamp:', error);
  }
};

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;
