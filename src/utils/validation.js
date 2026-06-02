/**
 * Input validation utilities using JSON Schema-like validation.
 */

const SCHEMAS = {
  createUser: {
    required: ['email', 'username', 'password'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: 255 },
      username: { type: 'string', minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9_-]+$/ },
      password: { type: 'string', minLength: 8, maxLength: 128 },
      displayName: { type: 'string', maxLength: 100 },
    },
  },
  updateUser: {
    properties: {
      displayName: { type: 'string', maxLength: 100 },
      bio: { type: 'string', maxLength: 500 },
      avatarUrl: { type: 'string', format: 'uri' },
    },
  },
  analyzeContent: {
    required: ['text'],
    properties: {
      text: { type: 'string', maxLength: 50000 },
      mediaUrls: { type: 'array', items: { type: 'string', format: 'uri' }, maxItems: 10 },
      context: { type: 'string', enum: ['post', 'comment', 'profile', 'message'] },
    },
  },
  flagContent: {
    required: ['contentId', 'reason'],
    properties: {
      contentId: { type: 'string' },
      reason: {
        type: 'string',
        enum: ['violence', 'spam', 'misinformation', 'harassment', 'other'],
      },
      reportedBy: { type: 'string' },
    },
  },
};

/**
 * Express middleware factory for validating request bodies against a named schema.
 *
 * @param {string} schemaName - Key in the SCHEMAS map
 * @returns {Function} Express middleware
 */
function validateSchema(schemaName) {
  const schema = SCHEMAS[schemaName];
  if (!schema) {
    throw new Error(`Unknown validation schema: ${schemaName}`);
  }

  return (req, res, next) => {
    const errors = validate(req.body, schema);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }
    next();
  };
}

/**
 * Validates a value against a simple schema definition.
 *
 * @param {*} data
 * @param {Object} schema
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validate(data, schema) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return ['Request body must be a JSON object'];
  }

  // Check required fields
  for (const field of schema.required || []) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Field '${field}' is required`);
    }
  }

  // Check property constraints
  for (const [field, constraints] of Object.entries(schema.properties || {})) {
    const value = data[field];
    if (value === undefined) continue;

    if (constraints.type === 'string' && typeof value !== 'string') {
      errors.push(`Field '${field}' must be a string`);
    } else if (constraints.type === 'string') {
      if (constraints.minLength && value.length < constraints.minLength) {
        errors.push(`Field '${field}' must be at least ${constraints.minLength} characters`);
      }
      if (constraints.maxLength && value.length > constraints.maxLength) {
        errors.push(`Field '${field}' must be at most ${constraints.maxLength} characters`);
      }
      if (constraints.pattern && !constraints.pattern.test(value)) {
        errors.push(`Field '${field}' contains invalid characters`);
      }
      if (constraints.enum && !constraints.enum.includes(value)) {
        errors.push(`Field '${field}' must be one of: ${constraints.enum.join(', ')}`);
      }
    }
  }

  return errors;
}

module.exports = { validateSchema, validate, SCHEMAS };
