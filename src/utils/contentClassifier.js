/**
 * Utility functions for content classification and severity scoring.
 */

/**
 * Content warning categories with metadata.
 * @type {Record<string, {label: string, defaultSeverity: string, description: string}>}
 */
const WARNING_CATEGORIES = {
  violence: {
    label: 'Violence',
    defaultSeverity: 'high',
    description: 'Depictions of physical harm or violent acts',
  },
  gore: {
    label: 'Graphic Gore',
    defaultSeverity: 'critical',
    description: 'Graphic depictions of injury or blood',
  },
  nudity: {
    label: 'Nudity',
    defaultSeverity: 'medium',
    description: 'Explicit or suggestive nudity',
  },
  language: {
    label: 'Strong Language',
    defaultSeverity: 'low',
    description: 'Profanity or offensive language',
  },
  spoilers: {
    label: 'Spoilers',
    defaultSeverity: 'low',
    description: 'Plot spoilers for movies, games, or shows',
  },
  mentalHealth: {
    label: 'Mental Health',
    defaultSeverity: 'medium',
    description: 'References to self-harm, suicide, or depression',
  },
  substanceUse: {
    label: 'Substance Use',
    defaultSeverity: 'medium',
    description: 'Depictions of drug or alcohol use',
  },
  politicalContent: {
    label: 'Political Content',
    defaultSeverity: 'low',
    description: 'Divisive political opinions or content',
  },
};

/**
 * Severity levels and their numeric scores.
 */
const SEVERITY_SCORES = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

/**
 * Computes the aggregate severity from an array of category keys.
 * Returns the highest severity found.
 *
 * @param {string[]} categories - Array of warning category keys
 * @returns {'low' | 'medium' | 'high' | 'critical'} Aggregate severity level
 */
function computeSeverity(categories) {
  if (!categories || categories.length === 0) return 'low';

  let maxScore = 0;
  let maxSeverity = 'low';

  for (const category of categories) {
    const meta = WARNING_CATEGORIES[category];
    if (!meta) continue;

    const score = SEVERITY_SCORES[meta.defaultSeverity] || 1;
    if (score > maxScore) {
      maxScore = score;
      maxSeverity = meta.defaultSeverity;
    }
  }

  return maxSeverity;
}

/**
 * Generates a human-readable label for a set of warning categories.
 *
 * @param {string[]} categories
 * @returns {string} Formatted label, e.g. "Violence, Strong Language"
 */
function formatWarningLabel(categories) {
  if (!categories || categories.length === 0) return '';

  return categories
    .map((c) => WARNING_CATEGORIES[c]?.label || c)
    .join(', ');
}

/**
 * Checks whether content should require an interstitial screen
 * (as opposed to a dismissible banner).
 *
 * @param {string} severity
 * @returns {boolean}
 */
function requiresInterstitial(severity) {
  return SEVERITY_SCORES[severity] >= SEVERITY_SCORES['high'];
}

module.exports = {
  WARNING_CATEGORIES,
  SEVERITY_SCORES,
  computeSeverity,
  formatWarningLabel,
  requiresInterstitial,
};
