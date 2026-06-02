/**
 * Express middleware setup: CORS, JSON parsing, request logging, rate limiting.
 */

const express = require('express');
const { logger } = require('./logger');

// Simple in-memory rate limiter
const rateLimitStore = new Map();

/**
 * Basic rate limiter: allows up to `maxRequests` per `windowMs`.
 */
function createRateLimiter({ windowMs = 60_000, maxRequests = 100 } = {}) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    rateLimitStore.set(key, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
    }

    next();
  };
}

/**
 * Request logger middleware.
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
    });
  });
  next();
}

/**
 * Configures all application-level middleware.
 * @param {import('express').Application} app
 */
function setupMiddleware(app) {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Basic CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(requestLogger);
  app.use(createRateLimiter());
}

module.exports = { setupMiddleware, createRateLimiter };
