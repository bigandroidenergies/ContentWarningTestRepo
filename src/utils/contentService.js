/**
 * ContentService - handles content analysis and flagging.
 */

const { computeSeverity, formatWarningLabel, WARNING_CATEGORIES } = require('./contentClassifier');

// Simple keyword-based classifier (illustrative only)
const CATEGORY_KEYWORDS = {
  violence: ['violence', 'fight', 'attack', 'assault', 'weapon', 'gun', 'knife', 'blood'],
  gore: ['gore', 'graphic', 'mutilation', 'wound'],
  nudity: ['nudity', 'explicit', 'sexual', 'nsfw'],
  language: ['profanity', 'expletive', 'offensive language'],
  spoilers: ['spoiler', 'plot twist', 'ending', 'dies', 'killed'],
  mentalHealth: ['suicide', 'self-harm', 'depression', 'eating disorder'],
  substanceUse: ['drugs', 'alcohol', 'cocaine', 'heroin', 'intoxicated'],
  politicalContent: ['political', 'partisan', 'election', 'conservative', 'liberal'],
};

class ContentService {
  /**
   * Analyzes content text for applicable warning categories.
   * @param {{ text: string, mediaUrls?: string[], context?: string }} options
   */
  async analyze({ text, mediaUrls = [], context }) {
    const lowerText = text.toLowerCase();
    const matchedCategories = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => lowerText.includes(kw))) {
        matchedCategories.push(category);
      }
    }

    const severity = computeSeverity(matchedCategories);
    const warnings = matchedCategories.map(
      (c) => WARNING_CATEGORIES[c]?.description || c
    );

    return {
      warnings,
      severity,
      categories: matchedCategories,
      confidence: matchedCategories.length > 0 ? 0.75 + Math.random() * 0.2 : 0,
      suggestedLabel: formatWarningLabel(matchedCategories),
    };
  }

  /**
   * Returns all available warning categories.
   */
  async getCategories() {
    return Object.entries(WARNING_CATEGORIES).map(([key, meta]) => ({ key, ...meta }));
  }

  /**
   * Creates a moderation flag for a piece of content.
   * @param {{ contentId: string, reason: string, reportedBy?: string, timestamp: string }} data
   */
  async flagForReview(data) {
    // In a real implementation, this would persist to a database
    return {
      id: `flag_${Date.now().toString(36)}`,
      ...data,
      status: 'pending',
    };
  }
}

module.exports = { ContentService };
