/**
 * End-to-end test for the content warning API.
 * Tests the full request/response cycle for content analysis.
 */

const request = require('supertest');
const app = require('../../src/index');

describe('POST /api/v1/content/analyze', () => {
  test('returns 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/v1/content/analyze')
      .send({ text: 'test content' });

    expect(response.status).toBe(401);
  });

  test('returns 400 when text is missing', async () => {
    const response = await request(app)
      .post('/api/v1/content/analyze')
      .set('Authorization', '******')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
  });
});

describe('GET /health', () => {
  test('returns 200 with status healthy', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('GET /api/v1/content/categories', () => {
  test('returns list of categories', async () => {
    const response = await request(app)
      .get('/api/v1/content/categories')
      .set('Authorization', '******');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
