/**
 * JWT-based authentication middleware.
 * Validates ******** in Authorization header.
 */

const { logger } = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Minimal JWT decode without full verification (for illustration).
 * In production, use a library like `jsonwebtoken`.
 *
 * @param {string} token
 * @returns {{ sub: string, exp: number, iat: number } | null}
 */
function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Express middleware that validates a ****** and attaches user context to req.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header',
    });
  }

  const token = authHeader.slice(7);
  const payload = decodeJwt(token);

  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token format' });
  }

  if (payload.exp && Date.now() / 1000 > payload.exp) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token has expired' });
  }

  req.user = { id: payload.sub, ...payload };
  logger.debug('Authenticated request', { userId: req.user.id });
  next();
}

module.exports = { authenticate };
