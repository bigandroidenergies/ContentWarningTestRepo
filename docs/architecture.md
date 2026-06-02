# Architecture Overview

## System Design

ContentWarningTestRepo follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────┐
│            Client Layer             │
│    (Web Browser / Mobile App)       │
└────────────────┬────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────┐
│           API Gateway Layer         │
│  Authentication · Rate Limiting     │
│         Request Validation          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│          Application Layer          │
│   Content Analysis · User Mgmt      │
│      Content Warning Logic          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│           Data Layer                │
│    Database · Cache · Storage       │
└─────────────────────────────────────┘
```

## Key Components

### ContentWarningBanner
A lightweight, dismissible UI component shown inline when content has a **low or medium severity** warning. Users can acknowledge and continue, or choose not to view the content.

### InterstitialScreen
A full-screen modal overlay triggered for **high or critical severity** content. Requires explicit user acknowledgment before revealing the content. Optionally requires a checkbox confirmation.

### Content Classifier
Utility module that maps raw content to warning categories and computes an aggregate severity score. Powers both the banner and interstitial components.

## Data Flow

1. Content is submitted to `POST /api/v1/content/analyze`
2. The classifier assigns warning categories and a severity score
3. The API returns structured warning metadata
4. The client renders either a `ContentWarningBanner` or `InterstitialScreen` based on severity
5. User acknowledgment is tracked and stored for audit purposes

## Configuration

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server listen port | `3000` |
| `NODE_ENV` | Environment name | `development` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis cache connection | — |
| `JWT_SECRET` | Secret for JWT signing | — |

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
