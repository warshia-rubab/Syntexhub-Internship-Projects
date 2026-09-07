const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import logger
const { logger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// Logger middleware - THIS WAS MISSING!
app.use(logger);

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user_management')
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
});

// ============================================
// ROUTES
// ============================================

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ============================================
// HOME ROUTE
// ============================================

app.get('/', (req, res) => {
    res.json({ message: '🚀 User Management API is running!' });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});