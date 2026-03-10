const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const resumeRoutes = require('./src/routes/resumes');
const pdfRoutes = require('./src/routes/pdf');
const emailRoutes = require('./src/routes/email');
const timeStatusRoutes = require('./src/routes/timeStatus');
const simplePDFRoutes = require('./src/routes/simplePDF');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// CORS configuration for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Always allow localhost for development
    const allowedOrigins = process.env.CORS_ORIGIN ? 
      [...process.env.CORS_ORIGIN.split(','), 'http://localhost:3000', 'http://localhost:5173'] : 
      ['http://localhost:3000', 'http://localhost:5173'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS rejected origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize deployment timestamp on server startup
  initializeDeploymentTimestamp();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

/**
 * Initialize deployment timestamp in config collection
 * Creates a singleton document with deployment timestamp if it doesn't exist
 */
async function initializeDeploymentTimestamp() {
  const Config = require('./src/models/Config');
  
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
}

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', timeStatusRoutes);
app.use('/api/simple-pdf', simplePDFRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'CRCCF Resume Builder API is running'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB URI configured: ${!!process.env.MONGO_URI}`);
  console.log(`⏰ Time limit: ${process.env.TIME_LIMIT_MINUTES || 20} minutes`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
