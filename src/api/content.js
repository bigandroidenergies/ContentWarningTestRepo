/**
 * Content warning detection and management routes.
 * Handles content moderation and warning classification.
 */

const express = require('express');
const router = express.Router();
const { ContentService } = require('../utils/contentService');
const { validateSchema } = require('../utils/validation');

const contentService = new ContentService();

/**
 * POST /api/v1/content/analyze
 * Analyze content and return applicable content warnings.
 */
router.post('/analyze', validateSchema('analyzeContent'), async (req, res, next) => {
  try {
    const { text, mediaUrls = [], context } = req.body;

    const analysis = await contentService.analyze({
      text,
      mediaUrls,
      context,
    });

    res.json({
      warnings: analysis.warnings,
      severity: analysis.severity,
      categories: analysis.categories,
      confidence: analysis.confidence,
      suggestedLabel: analysis.suggestedLabel,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/content/categories
 * List all available content warning categories.
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await contentService.getCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/content/flag
 * Flag a piece of content for manual review.
 */
router.post('/flag', validateSchema('flagContent'), async (req, res, next) => {
  try {
    const { contentId, reason, reportedBy } = req.body;

    const flag = await contentService.flagForReview({
      contentId,
      reason,
      reportedBy,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ data: flag });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
