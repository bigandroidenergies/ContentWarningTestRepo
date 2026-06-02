# API Reference

## Base URL

```
https://api.yourapp.example/api/v1
```

## Authentication

All API endpoints (except `/health`) require a valid ****** in the `Authorization` header:

```
Authorization: ******
```

---

## Users

### List Users

`GET /users`

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Results per page (max 100) |
| `search` | string | — | Filter by username or email |

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "usr_abc123",
      "username": "janedoe",
      "email": "jane@example.com",
      "displayName": "Jane Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "hasNext": true
  }
}
```

---

### Get User

`GET /users/:id`

**Response** `200 OK`

```json
{
  "data": {
    "id": "usr_abc123",
    "username": "janedoe",
    "email": "jane@example.com",
    "displayName": "Jane Doe",
    "bio": "Software engineer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**

- `404 Not Found` — User does not exist

---

### Create User

`POST /users`

**Request Body**

```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "securepassword123",
  "displayName": "New User"
}
```

**Response** `201 Created`

---

## Content

### Analyze Content

`POST /content/analyze`

Analyzes submitted content and returns applicable content warnings.

**Request Body**

```json
{
  "text": "Content to analyze...",
  "mediaUrls": ["https://example.com/image.jpg"],
  "context": "post"
}
```

**Response** `200 OK`

```json
{
  "warnings": ["Contains strong language", "References violence"],
  "severity": "high",
  "categories": ["language", "violence"],
  "confidence": 0.87,
  "suggestedLabel": "Violence, Strong Language"
}
```

---

### Get Categories

`GET /content/categories`

Returns all available content warning categories.

**Response** `200 OK`

```json
{
  "data": [
    {
      "key": "violence",
      "label": "Violence",
      "defaultSeverity": "high",
      "description": "Depictions of physical harm or violent acts"
    }
  ]
}
```

---

### Flag Content

`POST /content/flag`

Flags a piece of content for manual moderator review.

**Request Body**

```json
{
  "contentId": "post_xyz789",
  "reason": "violence",
  "reportedBy": "usr_abc123"
}
```

**Response** `201 Created`

---

## Error Format

All errors follow this structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable description",
  "details": ["Optional array of validation errors"]
}
```

**Common Status Codes**

| Code | Meaning |
|------|---------|
| `400` | Bad Request — validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `409` | Conflict — e.g. duplicate email |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error |
