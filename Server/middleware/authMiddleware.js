const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No authorization header or invalid format');
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized - No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Verifying token...');
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Fetch the full user object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};
