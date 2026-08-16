# Resume2Site Backend Full API Documentation and Application Flow

This document provides comprehensive API documentation for the Resume2Site backend MVP, along with the complete end-to-end application flow. It is intended for the frontend coding agent to integrate all APIs while ensuring the full app flow remains consistent across the application.

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview and Flow](#product-overview-and-flow)
3. [Base API Conventions](#base-api-conventions)
4. [API Endpoints](#api-endpoints)
   - [Health](#health)
   - [Authentication](#authentication)
   - [Resume Upload and Parsing](#resume-upload-and-parsing)
   - [Templates](#templates)
   - [Slug Validation](#slug-validation)
   - [Draft Profile Management](#draft-profile-management)
   - [Publishing](#publishing)
   - [Public Profile Rendering](#public-profile-rendering)
5. [Complete Application Flow](#complete-application-flow)
6. [Error Handling](#error-handling)
7. [Validation Rules](#validation-rules)
8. [Frontend Integration Notes](#frontend-integration-notes)

## Executive Summary

Resume2Site is a resume-first portfolio generation platform that converts uploaded resumes into editable, hosted professional portfolio websites. Users upload a resume (PDF/DOCX), the system parses it into structured data, allows editing and template selection, then publishes it under a personalized public URL.

## Product Overview and Flow

### Functional Overview
Resume2Site transforms static resumes into live, editable portfolio websites through these core systems:
- **Resume Intake System**: File upload and text extraction
- **Profile Structuring System**: Parsing raw content into structured professional data
- **Portfolio Generation System**: Template selection and preview rendering
- **Publishing System**: Public URL assignment and hosting
- **Profile Management System**: Post-publish editing and updates

### Key Differentiators
- **Resume-First Workflow**: Start with existing resume, not blank canvas
- **Instant Preview Before Signup**: Show value before requiring authentication
- **Structured Profile Schema**: Data independence from templates
- **One-Click Publishing**: Hosted portfolios with personalized URLs

## Base API Conventions

- **Base Path**: `/api`
- **Authentication**: JWT Bearer token in `Authorization: Bearer <token>` header
- **Anonymous Draft Access**: `X-Draft-Token: <draftToken>` header
- **Content Types**: 
  - JSON for requests/responses
  - `multipart/form-data` for file uploads
- **Success Response Envelope**:
```json
{
  "data": { /* response data */ }
}
```
- **Error Response Envelope**:
```json
{
  "timestamp": "2026-03-22T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/profiles/10",
  "fieldErrors": [
    {
      "field": "slug",
      "message": "slug must contain only lowercase letters, numbers, and hyphens"
    }
  ]
}
```

## API Endpoints

### Health

#### `GET /api/health`
Simple backend liveness check.

**Response**:
```json
{
  "data": {
    "status": "UP",
    "service": "resume2site-backend",
    "timestamp": "2026-03-22T10:15:30Z"
  }
}
```

### Authentication

#### `POST /api/auth/signup`
Create a new user account.

**Request**:
```json
{
  "email": "alice@example.com",
  "password": "password123",
  "fullName": "Alice Johnson"
}
```

**Response**:
```json
{
  "data": {
    "accessToken": "jwt-token-here",
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": 1,
      "email": "alice@example.com",
      "fullName": "Alice Johnson"
    }
  }
}
```

#### `POST /api/auth/login`
Authenticate existing user.

**Request**:
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response**: Same as signup.

#### `GET /api/auth/me`
Get current authenticated user info.

**Headers**:
- `Authorization: Bearer <token>`

**Response**:
```json
{
  "data": {
    "id": 1,
    "email": "alice@example.com",
    "fullName": "Alice Johnson"
  }
}
```

### Resume Upload and Parsing

#### `POST /api/resumes/upload`
Upload a resume file for processing.

**Content-Type**: `multipart/form-data`
**Field**: `file` (PDF or DOCX)
**Max Size**: 10MB

**Response**:
```json
{
  "data": {
    "id": 1,
    "originalFileName": "resume.pdf",
    "contentType": "application/pdf",
    "fileSizeBytes": 245678,
    "parseStatus": "UPLOADED"
  }
}
```

#### `POST /api/resumes/{resumeUploadId}/parse`
Parse uploaded resume into draft profile.

**Response**:
```json
{
  "data": {
    "resumeUploadId": 1,
    "parseStatus": "PARSED",
    "profile": {
      "id": 10,
      "draftToken": "draft-token-uuid",
      "fullName": "Alice Johnson",
      "headline": null,
      "summary": null,
      "email": null,
      "phone": null,
      "location": null,
      "publicationStatus": "DRAFT",
      "slug": null,
      "templateId": null,
      "sections": [],
      "links": [],
      "skills": [],
      "experiences": [],
      "education": [],
      "projects": []
    }
  }
}
```

### Templates

#### `GET /api/templates`
List all available templates.

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "code": "minimal-dev",
      "name": "Minimal Developer",
      "description": "Clean single-column template focused on early-career developers.",
      "previewImageUrl": null,
      "category": "developer",
      "accentColor": "#111827",
      "features": ["Single-column layout", "Readable project blocks"],
      "sortOrder": 1
    }
  ]
}
```

#### `GET /api/templates/{templateId}`
Get specific template details.

**Response**: Single template object as above.

### Slug Validation

#### `GET /api/slugs/check?value={slug}`
Check slug availability and validity.

**Response**:
```json
{
  "data": {
    "value": "alice-johnson",
    "valid": true,
    "available": true,
    "message": "Slug is available",
    "suggestions": []
  }
}
```

**Slug Rules**:
- 3-40 characters
- Lowercase letters, numbers, hyphens only
- No leading/trailing hyphens
- Reserved words blocked
- Case-insensitive uniqueness

### Draft Profile Management

**Authorization Model**: Accessible with either:
- Authenticated user ownership + Bearer token
- Valid `X-Draft-Token` header for anonymous drafts

#### `GET /api/profiles/{profileId}`
Get draft profile details.

**Headers** (for anonymous):
- `X-Draft-Token: <draftToken>`

**Response**:
```json
{
  "data": {
    "id": 10,
    "draftToken": "draft-token-uuid",
    "fullName": "Alice Johnson",
    "headline": "Software Engineer",
    "summary": "Backend-focused engineer...",
    "email": "alice@example.com",
    "phone": "+1-555-0100",
    "location": "New York, NY",
    "publicationStatus": "DRAFT",
    "slug": null,
    "templateId": 2,
    "sections": [
      {
        "sectionKey": "summary",
        "displayName": "About",
        "visible": true,
        "sortOrder": 0
      }
    ],
    "links": [
      {
        "id": 1,
        "label": "GitHub",
        "url": "https://github.com/alice",
        "sortOrder": 0
      }
    ],
    "skills": [
      {
        "id": 1,
        "name": "Spring Boot",
        "category": "Frameworks",
        "sortOrder": 0
      }
    ],
    "experiences": [
      {
        "id": 1,
        "company": "Acme Corp",
        "title": "Software Engineer",
        "location": "Remote",
        "startDate": "2024-01-01",
        "endDate": null,
        "isCurrent": true,
        "description": "Built internal APIs.",
        "sortOrder": 0
      }
    ],
    "education": [
      {
        "id": 1,
        "institution": "State University",
        "degree": "B.S.",
        "fieldOfStudy": "Computer Science",
        "startDate": "2020-08-01",
        "endDate": "2024-05-01",
        "grade": "3.8 GPA",
        "description": "Relevant coursework...",
        "sortOrder": 0
      }
    ],
    "projects": [
      {
        "id": 1,
        "name": "Resume2Site",
        "description": "Resume-first portfolio platform",
        "projectUrl": "https://example.com",
        "repositoryUrl": "https://github.com/alice/resume2site",
        "techStack": "Java, Spring Boot, React",
        "sortOrder": 0
      }
    ]
  }
}
```

#### `PUT /api/profiles/{profileId}`
Update basic profile information.

**Request**:
```json
{
  "fullName": "Alice Johnson",
  "headline": "Software Engineer",
  "summary": "Backend-focused engineer...",
  "email": "alice@example.com",
  "phone": "+1-555-0100",
  "location": "New York, NY",
  "templateId": 2
}
```

#### `PUT /api/profiles/{profileId}/sections`
Update profile section visibility and ordering.

**Request**:
```json
{
  "sections": [
    {
      "sectionKey": "summary",
      "displayName": "About",
      "visible": true,
      "sortOrder": 0
    }
  ]
}
```

#### Nested Item CRUD Operations

All operations require same auth headers as profile access.

**Links**:
- `POST /api/profiles/{profileId}/links`
- `PUT /api/profiles/{profileId}/links/{linkId}`
- `DELETE /api/profiles/{profileId}/links/{linkId}`

**Request** (create/update):
```json
{
  "label": "GitHub",
  "url": "https://github.com/alice",
  "sortOrder": 0
}
```

**Skills**:
- `POST /api/profiles/{profileId}/skills`
- `PUT /api/profiles/{profileId}/skills/{skillId}`
- `DELETE /api/profiles/{profileId}/skills/{skillId}`

**Request**:
```json
{
  "name": "Spring Boot",
  "category": "Frameworks",
  "sortOrder": 0
}
```

**Experiences**:
- `POST /api/profiles/{profileId}/experiences`
- `PUT /api/profiles/{profileId}/experiences/{experienceId}`
- `DELETE /api/profiles/{profileId}/experiences/{experienceId}`

**Request**:
```json
{
  "company": "Acme Corp",
  "title": "Software Engineer",
  "location": "Remote",
  "startDate": "2024-01-01",
  "endDate": null,
  "isCurrent": true,
  "description": "Built internal APIs.",
  "sortOrder": 0
}
```

**Education**:
- `POST /api/profiles/{profileId}/education`
- `PUT /api/profiles/{profileId}/education/{educationId}`
- `DELETE /api/profiles/{profileId}/education/{educationId}`

**Request**:
```json
{
  "institution": "State University",
  "degree": "B.S.",
  "fieldOfStudy": "Computer Science",
  "startDate": "2020-08-01",
  "endDate": "2024-05-01",
  "grade": "3.8 GPA",
  "description": "Relevant coursework...",
  "sortOrder": 0
}
```

**Projects**:
- `POST /api/profiles/{profileId}/projects`
- `PUT /api/profiles/{profileId}/projects/{projectId}`
- `DELETE /api/profiles/{profileId}/projects/{projectId}`

**Request**:
```json
{
  "name": "Resume2Site",
  "description": "Resume-first portfolio platform",
  "projectUrl": "https://example.com",
  "repositoryUrl": "https://github.com/alice/resume2site",
  "techStack": "Java, Spring Boot, React",
  "sortOrder": 0
}
```

### Publishing

#### `POST /api/profiles/{profileId}/publish`
Publish draft profile to public URL.

**Headers** (if publishing anonymous draft):
- `Authorization: Bearer <token>`
- `X-Draft-Token: <draftToken>`

**Request**:
```json
{
  "slug": "alice-johnson"
}
```

**Response**:
```json
{
  "data": {
    "profileId": 10,
    "slug": "alice-johnson",
    "publicationStatus": "PUBLISHED",
    "templateId": 2,
    "publicUrl": "/u/alice-johnson"
  }
}
```

#### `POST /api/profiles/{profileId}/republish`
Republish changes to existing published profile.

**Same request/response as publish.**

#### `PUT /api/profiles/{profileId}/slug`
Update slug for published profile.

**Authenticated only.**

**Request**:
```json
{
  "slug": "alice-johnson-dev"
}
```

### Public Profile Rendering

#### `GET /api/public/{slug}`
Get published profile for public rendering.

**Response**:
```json
{
  "data": {
    "slug": "alice-johnson",
    "publishedAt": "2026-03-22T10:15:30Z",
    "template": {
      "id": 2,
      "code": "modern-stack",
      "name": "Modern Stack"
    },
    "profile": {
      "fullName": "Alice Johnson",
      "headline": "Software Engineer",
      "summary": "Backend-focused engineer...",
      "email": "alice@example.com",
      "phone": "+1-555-0100",
      "location": "New York, NY",
      "sections": [],
      "links": [],
      "skills": [],
      "experiences": [],
      "education": [],
      "projects": []
    }
  }
}
```

## Complete Application Flow

### End-to-End Functional Flow

#### Phase 1: Anonymous Discovery & Creation
1. **User lands on homepage**
   - Understands value proposition: "Upload resume → get portfolio website instantly"

2. **User uploads resume** (`POST /api/resumes/upload`)
   - Validates file (PDF/DOCX, ≤10MB)
   - Returns upload ID

3. **System extracts text** (internal processing)

4. **System parses resume** (`POST /api/resumes/{id}/parse`)
   - Creates draft profile with extracted data
   - Returns `profile.id` and `profile.draftToken`

5. **User enters Draft Review Screen**
   - Frontend stores `profileId` and `draftToken` client-side

#### Phase 2: Structured Review & Correction
6. **User reviews extracted fields** (`GET /api/profiles/{profileId}`)
   - Headers: `X-Draft-Token: <draftToken>`
   - Shows: name, headline, summary, contact info, sections

7. **User corrects mistakes** (`PUT /api/profiles/{profileId}`)
   - Updates basic profile info
   - Tolerates empty/nullable fields

8. **User can hide/show sections** (`PUT /api/profiles/{profileId}/sections`)

#### Phase 3: Portfolio Generation & Preview
9. **User opens template gallery** (`GET /api/templates`)
   - Lists available templates with metadata

10. **User selects template** (`PUT /api/profiles/{profileId}`)
    - Updates `templateId`
    - Template can be null during editing

11. **System renders live preview**
    - Frontend uses structured data + selected template
    - Shows desktop/mobile previews

12. **User adjusts content**
    - Edits sections, reorders items
    - CRUD operations on nested items (links, skills, etc.)

#### Phase 4: Conversion to Registered User
13. **User clicks Publish**
    - If not logged in, prompts signup (`POST /api/auth/signup`)
    - Links draft to new account

14. **User chooses custom URL slug**
    - Checks availability (`GET /api/slugs/check?value={slug}`)
    - Validates format client-side

15. **User confirms publishing** (`POST /api/profiles/{profileId}/publish`)
    - Headers: `Authorization: Bearer <token>`, `X-Draft-Token: <draftToken>`
    - Returns public URL

#### Phase 5: Public Portfolio Lifecycle
16. **System marks profile as published**
    - Status: "PUBLISHED"
    - Public URL active at `/u/{slug}`

17. **User gets shareable URL**
    - Can copy and share with recruiters/employers

#### Phase 6: Post-Publish Management
18. **User logs in later** (`POST /api/auth/login`)

19. **Opens dashboard**
    - Lists owned profiles

20. **Edits content**
    - Same CRUD APIs, now with Bearer auth
    - No `X-Draft-Token` needed for owned profiles

21. **Switches template**
    - Updates `templateId`, data remains intact

22. **Saves and republishes** (`POST /api/profiles/{profileId}/republish`)

23. **Public page reflects updates** (`GET /api/public/{slug}`)

### Profile Lifecycle States
- **UPLOADED**: Resume file received
- **PARSED**: Draft data extracted
- **DRAFT**: Editable structured profile exists
- **PREVIEWED**: Template selected and preview generated
- **AUTHENTICATED**: Draft attached to user account
- **PUBLISHED**: Public URL is active
- **UPDATED/REPUBLISHED**: Changes reflected on public profile

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content (deletions)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing auth)
- **403**: Forbidden (access denied)
- **404**: Not Found
- **409**: Conflict (duplicate email, unavailable slug)
- **500**: Internal Server Error

### Validation Error Response
```json
{
  "timestamp": "2026-03-22T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/profiles/10",
  "fieldErrors": [
    {
      "field": "email",
      "message": "Email must be valid"
    },
    {
      "field": "slug",
      "message": "Slug must contain only lowercase letters, numbers, and hyphens"
    }
  ]
}
```

### Frontend Error Handling Guidelines
- **400 with fieldErrors**: Display field-level validation messages
- **401**: Redirect to login or show auth required
- **403**: Show access denied message
- **404 on public slug**: Treat as unpublished/not found
- **409 on signup**: Show email already exists
- **409 on publish**: Show slug unavailable, suggest alternatives

## Validation Rules

### User Registration
- **Email**: Required, valid format, ≤255 chars, unique
- **Password**: 8-72 characters
- **Full Name**: Required, ≤255 chars

### Resume Upload
- **File Types**: PDF, DOCX only
- **Max Size**: 10MB
- **Content**: Must be valid resume format

### Profile Data
- **Full Name**: ≤255 chars
- **Headline**: ≤255 chars
- **Summary**: Text, no length limit
- **Email**: Valid format, ≤255 chars
- **Phone**: ≤50 chars
- **Location**: ≤255 chars

### Slug Rules
- **Length**: 3-40 characters
- **Characters**: Lowercase letters, numbers, hyphens only
- **Format**: No leading/trailing hyphens, no consecutive hyphens
- **Reserved**: Blocks common words (admin, api, etc.)
- **Uniqueness**: Case-insensitive across all published profiles

### Nested Items
- **Sort Order**: Non-negative integers
- **URLs**: Valid URL format where applicable
- **Dates**: ISO format (YYYY-MM-DD)

## Frontend Integration Notes

### State Management
- **Persist `draftToken`** immediately after parse
- **Store `profileId`** for all draft operations
- **Switch to Bearer auth** after publish
- **Handle anonymous → authenticated** transition seamlessly

### API Usage Patterns
- **Always send `X-Draft-Token`** for anonymous draft requests
- **Include Bearer token** for authenticated requests
- **Check slug availability** before publish attempts
- **Tolerate partial data** from parsing (empty arrays, null fields)

### User Experience Flow
- **Show instant preview** before signup to create "wow moment"
- **Allow editing** before template selection
- **Validate slugs** in real-time during input
- **Handle conflicts** gracefully with suggestions
- **Maintain data** when switching templates

### Performance Considerations
- **Cache templates** after first load
- **Debounce slug checks** during typing
- **Lazy load** complex previews if needed
- **Optimistic updates** for better UX

### Security Notes
- **Never expose `draftToken`** in URLs or logs
- **Use HTTPS** for all API calls
- **Validate file uploads** client-side before sending
- **Sanitize user input** for XSS prevention

This documentation ensures consistent implementation across the full application flow while providing all necessary API details for complete frontend integration.