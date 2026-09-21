require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./config/logger');

const app = express();

// CORS first
app.use(cors());

// Helmet with adjusted CSP (allows inline scripts/styles + CDN)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Body parser
app.use(express.json());

// Request logger BEFORE static
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { ip: req.ip });
  next();
});

// API routes FIRST
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/test', require('./routes/test'));

// Static frontend (AFTER API routes)
app.use(express.static(path.join(__dirname, '../frontend')));

// Explicit root fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 handler for non-API routes → serve index.html (SPA-style)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});