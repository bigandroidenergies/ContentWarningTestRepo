/**
 * UserService - handles user data persistence and retrieval.
 * Uses an in-memory store for demonstration purposes.
 */

let userStore = [
  {
    id: 'usr_001',
    username: 'alice_dev',
    email: 'alice@example.com',
    displayName: 'Alice Developer',
    bio: 'Full-stack developer passionate about accessibility.',
    createdAt: '2024-01-10T09:00:00Z',
    deletedAt: null,
  },
  {
    id: 'usr_002',
    username: 'bob_qa',
    email: 'bob@example.com',
    displayName: 'Bob Quality',
    bio: 'QA engineer focused on mobile testing.',
    createdAt: '2024-01-12T14:30:00Z',
    deletedAt: null,
  },
];

class UserService {
  /**
   * Lists users with pagination and optional search.
   * @param {{ page: number, limit: number, search?: string }} options
   */
  async list({ page = 1, limit = 20, search } = {}) {
    let filtered = userStore.filter((u) => !u.deletedAt);

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.displayName.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    return {
      items,
      page,
      limit,
      total,
      hasNext: offset + limit < total,
    };
  }

  /**
   * Finds a user by their ID.
   * @param {string} id
   * @returns {Object|null}
   */
  async findById(id) {
    return userStore.find((u) => u.id === id && !u.deletedAt) || null;
  }

  /**
   * Creates a new user.
   * @param {{ email: string, username: string, password: string, displayName?: string }} data
   */
  async create({ email, username, password: _password, displayName }) {
    const existing = userStore.find((u) => u.email === email && !u.deletedAt);
    if (existing) {
      const err = new Error('Email already registered');
      err.code = 'DUPLICATE_EMAIL';
      throw err;
    }

    const user = {
      id: `usr_${Date.now().toString(36)}`,
      username,
      email,
      displayName: displayName || username,
      bio: '',
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    userStore.push(user);
    // Never return the password
    return user;
  }

  /**
   * Updates an existing user's profile fields.
   * @param {string} id
   * @param {Partial<{displayName: string, bio: string, avatarUrl: string}>} data
   */
  async update(id, data) {
    const idx = userStore.findIndex((u) => u.id === id && !u.deletedAt);
    if (idx === -1) return null;

    const allowedFields = ['displayName', 'bio', 'avatarUrl'];
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        userStore[idx][field] = data[field];
      }
    }

    return userStore[idx];
  }

  /**
   * Soft-deletes a user by setting `deletedAt`.
   * @param {string} id
   */
  async softDelete(id) {
    const user = userStore.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    user.deletedAt = new Date().toISOString();
  }
}

module.exports = { UserService };
