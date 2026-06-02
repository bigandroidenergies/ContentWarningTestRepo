/**
 * Unit tests for input validation utilities.
 */

const { validate, SCHEMAS } = require('../../src/utils/validation');

describe('validate - createUser schema', () => {
  const schema = SCHEMAS.createUser;

  test('passes valid user data', () => {
    const errors = validate(
      {
        email: 'test@example.com',
        username: 'testuser',
        password: 'securepass123',
      },
      schema
    );
    expect(errors).toHaveLength(0);
  });

  test('fails when required fields are missing', () => {
    const errors = validate({}, schema);
    expect(errors).toContain("Field 'email' is required");
    expect(errors).toContain("Field 'username' is required");
    expect(errors).toContain("Field 'password' is required");
  });

  test('fails when username is too short', () => {
    const errors = validate(
      { email: 'a@b.com', username: 'ab', password: 'password123' },
      schema
    );
    expect(errors.some((e) => e.includes('username'))).toBe(true);
  });

  test('fails when username contains invalid characters', () => {
    const errors = validate(
      { email: 'a@b.com', username: 'user name!', password: 'password123' },
      schema
    );
    expect(errors.some((e) => e.includes('username'))).toBe(true);
  });
});

describe('validate - analyzeContent schema', () => {
  const schema = SCHEMAS.analyzeContent;

  test('passes with just text', () => {
    const errors = validate({ text: 'Hello world' }, schema);
    expect(errors).toHaveLength(0);
  });

  test('fails when text is missing', () => {
    const errors = validate({}, schema);
    expect(errors).toContain("Field 'text' is required");
  });

  test('fails with invalid context enum value', () => {
    const errors = validate({ text: 'hello', context: 'invalid' }, schema);
    expect(errors.some((e) => e.includes('context'))).toBe(true);
  });

  test('passes with valid context value', () => {
    const errors = validate({ text: 'hello', context: 'post' }, schema);
    expect(errors).toHaveLength(0);
  });
});

describe('validate - general error handling', () => {
  test('returns error for non-object body', () => {
    const errors = validate('not an object', SCHEMAS.createUser);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/JSON object/);
  });

  test('returns error for null body', () => {
    const errors = validate(null, SCHEMAS.createUser);
    expect(errors).toHaveLength(1);
  });
});
