/**
 * API router factory.
 * Wires up all route handlers and applies route-level middleware.
 */

const express = require('express');
const { authenticate } = require('../utils/auth');
const usersRouter = require('./users');
const contentRouter = require('./content');

/**
 * Creates and configures the main API router.
 * @returns {express.Router} Configured router instance
 */
function createApiRouter() {
  const router = express.Router();

  // Apply authentication to all API routes
  router.use(authenticate);

  // Mount sub-routers
  router.use('/users', usersRouter);
  router.use('/content', contentRouter);

  // API version info
  router.get('/', (req, res) => {
    res.json({
      version: 'v1',
      endpoints: ['/users', '/content'],
      docs: 'https://github.com/bigandroidenergies/ContentWarningTestRepo/blob/main/docs/api-reference.md',
    });
  });

  return router;
}

module.exports = { createApiRouter };
