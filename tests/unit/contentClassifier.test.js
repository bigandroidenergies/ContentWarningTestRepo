/**
 * Unit tests for the content classifier utility.
 */

const {
  computeSeverity,
  formatWarningLabel,
  requiresInterstitial,
  WARNING_CATEGORIES,
} = require('../../src/utils/contentClassifier');

describe('computeSeverity', () => {
  test('returns "low" for empty category list', () => {
    expect(computeSeverity([])).toBe('low');
  });

  test('returns "low" for null input', () => {
    expect(computeSeverity(null)).toBe('low');
  });

  test('returns severity of single category', () => {
    expect(computeSeverity(['language'])).toBe('low');
    expect(computeSeverity(['violence'])).toBe('high');
    expect(computeSeverity(['gore'])).toBe('critical');
  });

  test('returns highest severity when multiple categories provided', () => {
    expect(computeSeverity(['language', 'violence'])).toBe('high');
    expect(computeSeverity(['spoilers', 'gore', 'language'])).toBe('critical');
  });

  test('ignores unknown categories', () => {
    expect(computeSeverity(['unknownCategory'])).toBe('low');
    expect(computeSeverity(['violence', 'unknownCategory'])).toBe('high');
  });
});

describe('formatWarningLabel', () => {
  test('returns empty string for empty categories', () => {
    expect(formatWarningLabel([])).toBe('');
  });

  test('formats single category correctly', () => {
    expect(formatWarningLabel(['violence'])).toBe('Violence');
    expect(formatWarningLabel(['language'])).toBe('Strong Language');
  });

  test('formats multiple categories with comma separator', () => {
    const result = formatWarningLabel(['violence', 'language']);
    expect(result).toBe('Violence, Strong Language');
  });

  test('uses raw key for unknown categories', () => {
    expect(formatWarningLabel(['customCategory'])).toBe('customCategory');
  });
});

describe('requiresInterstitial', () => {
  test('returns false for low severity', () => {
    expect(requiresInterstitial('low')).toBe(false);
  });

  test('returns false for medium severity', () => {
    expect(requiresInterstitial('medium')).toBe(false);
  });

  test('returns true for high severity', () => {
    expect(requiresInterstitial('high')).toBe(true);
  });

  test('returns true for critical severity', () => {
    expect(requiresInterstitial('critical')).toBe(true);
  });
});

describe('WARNING_CATEGORIES', () => {
  test('all categories have required fields', () => {
    for (const [key, meta] of Object.entries(WARNING_CATEGORIES)) {
      expect(meta).toHaveProperty('label');
      expect(meta).toHaveProperty('defaultSeverity');
      expect(meta).toHaveProperty('description');
      expect(['low', 'medium', 'high', 'critical']).toContain(meta.defaultSeverity);
    }
  });
});
