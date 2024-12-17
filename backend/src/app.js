const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const nurseRoutes = require('./routes/nurses');
const caregiverRoutes = require('./routes/caregivers');
const adminRoutes = require('./routes/admin');
const logger = require('./middleware/logger');

const app = express();

// CORS configuration with detailed logging
app.use((req, res, next) => {
    console.log('CORS Pre-flight:', {
        origin: req.headers.origin,
        method: req.method,
        headers: req.headers
    });
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 健康检查接口
app.get('/api/health', (req, res) => {
    console.log('Health check requested:', {
        timestamp: new Date().toISOString(),
        headers: req.headers
    });
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'nursing-house-backend'
    });
});

// 调试路由
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`健康检查接口: http://10.108.69.36:${PORT}/api/health`);
    console.log('CORS配置:', {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });
});

module.exports = app; 