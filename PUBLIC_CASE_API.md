# Public Case Submission API

## Overview

The Public Case Submission API allows external users to submit whistleblowing cases directly to your complaint management system. This endpoint is publicly accessible and does not require authentication.

## Endpoint

```
POST /api/public/cases/submit
```

## Features

- ✅ **Public Access**: No authentication required
- ✅ **Rate Limiting**: 5 submissions per 5 minutes per IP
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **Validation**: Comprehensive input validation with Zod
- ✅ **Company Resolution**: Automatic company lookup via subdomain
- ✅ **Dictionary Resolution**: Automatic key-to-ID mapping for categories, priorities, and severities
- ✅ **Anonymous Support**: Optional anonymous submissions
- ✅ **Reporter Information**: Optional reporter contact details

## Request Format

### Headers

```
Content-Type: application/json
```

### Request Body Schema

```typescript
interface CaseSubmissionRequest {
  subdomain: string // Company subdomain (3-63 chars, lowercase alphanumeric with hyphens)
  title: string // Case title (5-500 characters)
  description: string // Case description (10-5000 characters)
  typeKey?: string // Case type key (default: "complaint")
  categoryKey: string // Category key (required)
  priorityKey?: string // Priority key (default: "medium")
  severityKey?: string // Severity key (default: "medium")
  isAnonymous?: boolean // Anonymous submission (default: true)
  visibility?: string // Visibility level: "public" | "internal" | "restricted" (default: "internal")
  reporterName?: string // Reporter name (max 255 chars, required if not anonymous)
  reporterEmail?: string // Reporter email (max 320 chars, required if not anonymous)
  reporterPhone?: string // Reporter phone (max 50 chars, optional)
  tags?: string[] // Case tags (optional)
}
```

## Example Requests

### Anonymous Case Submission

```bash
curl -X POST "https://your-domain.com/api/public/cases/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "devisium",
    "title": "Safety violation in manufacturing area",
    "description": "I observed unsafe working conditions in the manufacturing area that could lead to serious injuries. Workers are not wearing proper protective equipment and safety protocols are not being followed.",
    "categoryKey": "safety",
    "priorityKey": "high",
    "severityKey": "high",
    "isAnonymous": true,
    "visibility": "internal",
    "tags": ["safety", "manufacturing", "urgent"]
  }'
```

### Non-Anonymous Case Submission

```bash
curl -X POST "https://your-domain.com/api/public/cases/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "devisium",
    "title": "Financial irregularities in accounting department",
    "description": "I have noticed discrepancies in financial records that suggest potential fraud or mismanagement in the accounting department. This requires immediate investigation.",
    "categoryKey": "fraud",
    "priorityKey": "urgent",
    "severityKey": "critical",
    "isAnonymous": false,
    "visibility": "restricted",
    "reporterName": "John Doe",
    "reporterEmail": "john.doe@example.com",
    "reporterPhone": "+1-555-0123",
    "tags": ["financial", "fraud", "accounting"]
  }'
```

### Simple Case Submission (Minimal Required Fields)

```bash
curl -X POST "https://your-domain.com/api/public/cases/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "devisium",
    "title": "Workplace harassment incident",
    "description": "There has been ongoing harassment in the workplace that needs to be addressed immediately. Multiple employees are affected.",
    "categoryKey": "harassment"
  }'
```

## Example Responses

### Success Response (201 Created)

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

### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": "title: Title must be at least 5 characters, description: Description must be at least 10 characters"
}
```

### Rate Limit Error Response (429 Too Many Requests)

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please wait before submitting another case."
}
```

### Company Not Found Error (404 Not Found)

```json
{
  "success": false,
  "error": "Company not found"
}
```

### Invalid Category/Priority/Severity Error (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid category: invalid-category-key"
}
```

### Server Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Failed to submit case. Please try again later."
}
```

## Available Categories

To get the list of available categories for a specific company, you can query the configuration endpoint:

```bash
curl "https://your-domain.com/api/config/{subdomain}"
```

Example available categories for `devisium`:
- `harassment` - Harassment
- `discrimination` - Discrimination
- `fraud` - Fraud
- `safety` - Safety Violation
- `ethics` - Ethics Violation
- `environment` - Environment
- `retaliation` - Retaliation
- `theft` - Theft
- `other` - Other

## Validation Rules

### Required Fields

- `subdomain`: Company identifier (3-63 characters, lowercase alphanumeric with hyphens)
- `title`: Case title (5-500 characters)
- `description`: Case description (10-5000 characters)
- `categoryKey`: Valid category key from the system

### Optional Fields with Defaults

- `typeKey`: Defaults to `"complaint"`
- `priorityKey`: Defaults to `"medium"`
- `severityKey`: Defaults to `"medium"`
- `isAnonymous`: Defaults to `true`
- `visibility`: Defaults to `"internal"`
- `tags`: Defaults to empty array

### Conditional Requirements

- If `isAnonymous` is `false`, then `reporterEmail` is required
- All dictionary keys (`categoryKey`, `priorityKey`, `severityKey`) must exist in the system and be active

## Rate Limiting

- **Limit**: 5 submissions per IP address
- **Window**: 5 minutes (300 seconds)
- **Cleanup**: Automatic cleanup of expired rate limit entries
- **Response**: HTTP 429 with `Retry-After: 300` header

## CORS Support

The endpoint supports cross-origin requests with the following configuration:

```
Access-Control-Allow-Origin: * (configurable via FORMS_DOMAIN env var)
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400 (24 hours)
```

## Security Features

1. **Input Validation**: Comprehensive validation using Zod schemas
2. **Rate Limiting**: Prevents abuse with IP-based rate limiting
3. **SQL Injection Protection**: Parameterized queries
4. **XSS Protection**: Input sanitization
5. **Error Handling**: Secure error messages that don't expose internal details

## Integration Notes

### Frontend Integration

```javascript
async function submitCase(caseData) {
  try {
    const response = await fetch('/api/public/cases/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData),
    })

    const result = await response.json()

    if (result.success) {
      console.log('Case submitted successfully:', result.case.caseNumber)
      return result
    } else {
      console.error('Failed to submit case:', result.error)
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Network error:', error)
    throw error
  }
}
```

### Getting Available Dictionary Values

Before submitting cases, you can fetch available categories:

```bash
# Get case metadata (categories, priorities, severities, statuses)
curl -X GET "https://your-domain.com/api/config/{subdomain}"
```

## Implementation Details

### File Structure

- **API Route**: `src/app/api/public/cases/submit/route.ts`
- **Types**: `src/types/index.ts` (CaseSubmissionRequest, CaseSubmissionResponse)
- **Validation**: `src/lib/validation.ts` (caseSubmissionSchema, validateCaseSubmission)

### Key Features

1. **TypeScript Types**: Fully typed interfaces for request/response
2. **Zod Validation**: Runtime validation with detailed error messages
3. **Rate Limiting**: In-memory storage with automatic cleanup
4. **CORS Headers**: Configurable origin support
5. **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## Environment Variables

- `FORMS_DOMAIN`: Domain allowed for CORS requests (defaults to `*` if not set)
- `DASHBOARD_API_URL`: Backend dashboard API URL for proxying requests

## Error Codes Summary

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 201         | Case created successfully                   |
| 400         | Validation error or invalid dictionary keys |
| 404         | Company not found                           |
| 429         | Rate limit exceeded                         |
| 500         | Internal server error                       |
| 503         | Dashboard API URL not configured            |

## Production Considerations

1. **Rate Limiting Storage**: Consider using Redis for rate limiting in production environments with multiple instances
2. **Monitoring**: Add logging and monitoring for API usage and errors
3. **Security**: Consider adding additional security measures like CAPTCHA for public endpoints
4. **Performance**: Monitor response times and optimize database queries if needed
