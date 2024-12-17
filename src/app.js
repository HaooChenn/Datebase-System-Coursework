const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const nurseRoutes = require('./routes/nurses');
const caregiverRoutes = require('./routes/caregivers');
const adminRoutes = require('./routes/admin');
const morgan = require('morgan');

const app = express();

// Database connection
const pool = mysql.createPool({
  host: 'test-db-mysql.ns-qe6p72x2.svc',
  user: 'root',
  password: 'b7kvfwgj',
  database: 'nursing_home',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Make db pool available in req
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Increase payload size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nursing-house-backend',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'nursing-house-backend',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Something broke!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('CORS enabled for all origins');
  console.log('Database pool configured with:', {
    connectionLimit: pool.config.connectionLimit,
    connectTimeout: pool.config.connectTimeout,
    queueLimit: pool.config.queueLimit
  });
}); 