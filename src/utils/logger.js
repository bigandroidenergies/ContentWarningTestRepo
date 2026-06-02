/**
 * Structured logger utility using console with timestamps and levels.
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = LOG_LEVELS[(process.env.LOG_LEVEL || '').toLowerCase()] ?? LOG_LEVELS.info;

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

const logger = {
  debug: (message, meta) => {
    if (LOG_LEVELS.debug >= MIN_LEVEL) console.debug(formatMessage('debug', message, meta));
  },
  info: (message, meta) => {
    if (LOG_LEVELS.info >= MIN_LEVEL) console.info(formatMessage('info', message, meta));
  },
  warn: (message, meta) => {
    if (LOG_LEVELS.warn >= MIN_LEVEL) console.warn(formatMessage('warn', message, meta));
  },
  error: (message, meta) => {
    if (LOG_LEVELS.error >= MIN_LEVEL) console.error(formatMessage('error', message, meta));
  },
};

module.exports = { logger };
