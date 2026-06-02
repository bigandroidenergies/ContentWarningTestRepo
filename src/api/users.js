/**
 * Users API routes.
 * Handles CRUD operations for user resources.
 */

const express = require('express');
const router = express.Router();
const { UserService } = require('../utils/userService');
const { validateSchema } = require('../utils/validation');

const userService = new UserService();

/**
 * GET /api/v1/users
 * List all users with optional filtering and pagination.
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const users = await userService.list({ page: Number(page), limit: Number(limit), search });
    res.json({
      data: users.items,
      pagination: {
        page: users.page,
        limit: users.limit,
        total: users.total,
        hasNext: users.hasNext,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/users/:id
 * Get a single user by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/users
 * Create a new user.
 */
router.post('/', validateSchema('createUser'), async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
});

/**
 * PATCH /api/v1/users/:id
 * Update an existing user.
 */
router.patch('/:id', validateSchema('updateUser'), async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/users/:id
 * Soft-delete a user account.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await userService.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
