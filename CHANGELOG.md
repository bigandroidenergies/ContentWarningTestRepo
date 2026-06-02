# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Content warning banner component with severity-based styling
- Interstitial screen component for high/critical content
- Content classifier utility with category and severity scoring
- Input validation middleware with JSON schema support
- JWT authentication middleware
- Rate limiting middleware
- Express API server with `/api/v1/users` and `/api/v1/content` routes
- GitHub Actions workflows: CI, Release, Security Scan
- Issue templates: Bug Report, Feature Request
- Comprehensive API documentation

## [1.1.0] - 2024-03-15

### Added
- Mobile responsive CSS for banner and interstitial components
- `requiresInterstitial()` utility function
- `formatWarningLabel()` helper for generating human-readable warning labels
- Support for `substanceUse` and `politicalContent` warning categories

### Changed
- Improved `computeSeverity()` to correctly handle unknown category keys
- Updated `ContentWarningBanner` to use semantic HTML `role="alert"`

### Fixed
- Interstitial backdrop click now correctly calls `onCancel` callback
- Banner dismiss animation no longer leaves ghost element in DOM

## [1.0.1] - 2024-02-28

### Fixed
- `_escapeHtml` method not escaping single quotes in warning labels (#42)
- Rate limiter `resetAt` calculation off by one error (#39)
- Auth middleware returning 500 on malformed JWT instead of 401 (#37)

### Security
- Switched from `eval()` to `JSON.parse(Buffer.from(..., 'base64url'))` for JWT decode

## [1.0.0] - 2024-02-01

### Added
- Initial release of ContentWarningTestRepo
- `ContentWarningBanner` component
- `InterstitialScreen` component
- Content classifier utility
- REST API with content analysis endpoint
- MIT License

[Unreleased]: https://github.com/bigandroidenergies/ContentWarningTestRepo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/bigandroidenergies/ContentWarningTestRepo/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/bigandroidenergies/ContentWarningTestRepo/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bigandroidenergies/ContentWarningTestRepo/releases/tag/v1.0.0
