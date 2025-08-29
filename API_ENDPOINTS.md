# Zaupy Forms - API Endpoints Documentation

This document outlines the API endpoints used by the Zaupy Forms application.

## Architecture

The forms application uses **local proxy routes** that forward requests to the dashboard API. This provides:
- Development fallbacks when dashboard is not running
- Request/response transformation if needed
- CORS handling
- Error handling and logging

## API Endpoints

### 1. Configuration API
**Endpoint**: `GET /api/config/{subdomain}`
**Proxies to**: `GET /api/public/forms/{subdomain}/config`

**Purpose**: Fetch company branding, categories, and form settings

**Example Request**:
```
GET /api/config/devisium
```

**Response**:
```json
{
  "company": {
    "id": "uuid",
    "name": "Company Name",
    "subdomain": "devisium"
  },
  "branding": {
    "name": "Company Portal",
    "logo": "logo-url",
    "subdomain": "devisium"
  },
  "colors": {
    "primary": "#hex",
    "accent": "#hex",
    "success": "#hex",
    "error": "#hex"
  },
  "categories": [...],
  "formSettings": {...}
}
```

### 2. Submission API
**Endpoint**: `POST /api/submit`
**Proxies to**: `POST /api/public/reports/submit`

**Purpose**: Submit reports with full validation

**Example Request (JSON - no files)**:
```json
POST /api/submit
Content-Type: application/json

{
  "subdomain": "demo",
  "categoryId": "harassment", 
  "subject": "Workplace issue",
  "description": "This is a test report to verify the API works correctly",
  "trackingMode": "private",
  "trackingPassword": "test123",
  "isAnonymous": true,
  "priority": "medium"
}
```

**Example Request (FormData - with files)**:
```
POST /api/submit
Content-Type: multipart/form-data

data: {JSON string of the above object}
files: [File objects]
```

**Response**:
```json
{
  "success": true,
  "trackingId": "DEMO-01A1B2",
  "message": "Report submitted successfully"
}
```

### 3. Public Case Submission API
**Endpoint**: `POST /api/public/cases/submit`
**Proxies to**: `POST /api/public/cases/submit` (Dashboard API)

**Purpose**: Submit whistleblowing cases directly to the complaint management system

**Features**:
- ✅ Public access (no authentication required)
- ✅ Rate limiting (5 submissions per 5 minutes per IP)
- ✅ CORS support (cross-origin requests enabled)
- ✅ Comprehensive validation with Zod
- ✅ Company resolution via subdomain
- ✅ Dictionary key-to-ID mapping
- ✅ Anonymous support
- ✅ Reporter information (optional)

**Example Request**:
```json
POST /api/public/cases/submit
Content-Type: application/json

{
  "subdomain": "devisium",
  "title": "Safety violation in manufacturing area",
  "description": "I observed unsafe working conditions in the manufacturing area that could lead to serious injuries.",
  "categoryKey": "safety",
  "priorityKey": "high",
  "severityKey": "high",
  "isAnonymous": true,
  "visibility": "internal",
  "tags": ["safety", "manufacturing", "urgent"]
}
```

**Response**:
```json
{
  "success": true,
  "case": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "caseNumber": "DEV-2025-001",
    "title": "Safety violation in manufacturing area",
    "status": "triage",
    "createdAt": "2025-01-11T10:30:00.000Z"
  },
  "message": "Case submitted successfully"
}
```

### 4. Tracking API
**Endpoint**: `GET /api/track/{trackingId}?password=optional`
**Proxies to**: `GET /api/reports/track/{trackingId}?password=optional`

**Purpose**: Track report status and view updates

**Example Request**:
```
GET /api/track/TR-123456?password=mypassword
```

**Response**:
```json
{
  "success": true,
  "report": {
    "trackingId": "TR-123456",
    "status": "in_review",
    "subject": "Report subject",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-02T15:30:00Z",
    "comments": [
      {
        "content": "Report received",
        "isInternal": false,
        "createdAt": "2024-01-01T10:05:00Z"
      }
    ]
  }
}
```

## Environment Variables

### Required
- `DASHBOARD_API_URL`: Base URL of the dashboard API (e.g., `http://localhost:8000`)

### Optional
- `NEXT_PUBLIC_SUBDOMAIN_FALLBACK`: Default subdomain for local development (e.g., `devisium`)
- `NEXT_PUBLIC_APP_URL`: Forms app URL (auto-detected if not set)

## Error Handling

All proxy routes return consistent error responses:

**503 Service Unavailable**: Dashboard API URL not configured
```json
{
  "error": "Dashboard API URL not configured"
}
```

**502 Bad Gateway**: Failed to connect to dashboard API
```json
{
  "error": "Failed to connect to dashboard API"
}
```

**Other Status Codes**: Forwarded from dashboard API with original status and response body.

## Development Setup

1. Set `DASHBOARD_API_URL` in `.env.local`:
   ```
   DASHBOARD_API_URL=http://localhost:8000
   NEXT_PUBLIC_SUBDOMAIN_FALLBACK=devisium
   ```

2. Start the forms application:
   ```bash
   npm run dev
   ```

3. The forms app will proxy all API calls to your dashboard API automatically.

## Security Considerations

- All requests are proxied server-side to avoid CORS issues
- Sensitive headers are not exposed to the client
- File uploads are handled securely through FormData
- Authentication is handled by the dashboard API
