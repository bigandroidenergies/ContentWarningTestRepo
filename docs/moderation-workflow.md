# Moderation Workflow

This document describes the lightweight moderation flow used by the sample app data.

## Goals

- Provide predictable records for UI testing
- Keep category and severity outputs consistent across environments
- Model a realistic "flag → review → resolve" path

## Workflow Steps

1. **Analyze content** via `POST /api/v1/content/analyze`
2. **Auto-label warnings** from matched categories (`language`, `violence`, `nudity`, etc.)
3. **Flag for review** when severity is `high` or `critical`
4. **Moderator decision**: `allow`, `warn-only`, or `remove`
5. **Audit trail** stores who reviewed, when, and reason

## Example Review Payload

```json
{
  "contentId": "post_4471",
  "categories": ["violence", "nudity"],
  "severity": "high",
  "status": "pending",
  "reportedBy": "auto-classifier",
  "createdAt": "2026-06-01T09:20:00Z"
}
```

## Resolution States

| State | Meaning |
|-------|---------|
| `pending` | Waiting for moderator action |
| `approved` | Content allowed to remain |
| `restricted` | Content shown behind stronger warning/interstitial |
| `removed` | Content removed from feed |

## Notes for UI Testing

- Keep at least one item in each resolution state for list/filter testing.
- Include a mix of low, medium, and high severities to exercise banner vs. interstitial UI.
- Preserve stable IDs in fixture data so screenshots can be compared across runs.
