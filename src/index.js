/**
 * Main application entry point.
 * Starts the Express server and sets up middleware.
 */

const express = require('express');
const { createApiRouter } = require('./api/router');
const { setupMiddleware } = require('./utils/middleware');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const app = express();

// Setup middleware (CORS, JSON parsing, rate limiting)
setupMiddleware(app);

// Mount API routes
app.use('/api/v1', createApiRouter());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
