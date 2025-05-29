const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug environment variables
console.log('Environment variables:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/list', listRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error',
      details: err.errors 
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
  
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - must be after error handling
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  // Give time for logging before exit
  setTimeout(() => process.exit(1), 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  // Give time for logging before exit
  setTimeout(() => process.exit(1), 1000);
});

// MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Log the connection string (without sensitive data)
    console.log('Attempting to connect to MongoDB...');
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Try connecting with explicit localhost
    const uri = 'mongodb://127.0.0.1:27017/newel';
    console.log('Using connection string:', uri);
    
    await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');
    
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    // Give time for logging before exit
    setTimeout(() => process.exit(1), 1000);
  }
};

// Start server
connectDB();
