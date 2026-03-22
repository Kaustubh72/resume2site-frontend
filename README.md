# Resume2Site Frontend

Angular frontend for the Resume2Site MVP: upload a resume without login, generate an editable draft profile, preview one of three templates, authenticate only at publish time, claim a slug, and render the live portfolio at `/u/:slug`.

## Current MVP scope

- Landing page with embedded upload CTA
- Dedicated upload route with client-side PDF/DOCX validation
- Draft editor for core profile fields, links, skills, experience, education, and projects
- Template gallery plus live preview for `classic`, `minimal`, and `spotlight`
- Publish flow with inline auth, slug validation, availability checks, and success actions
- Dashboard for editing, template switching, and republishing
- Public portfolio rendering with loading, unavailable, and not-found states

## Route overview

- `/` — landing page + anonymous upload
- `/upload` — dedicated upload flow
- `/draft/:profileId` — draft editor
- `/templates/:profileId` — template gallery
- `/templates/:profileId/preview/:templateId` — live preview
- `/auth` — standalone auth route
- `/publish/:profileId` — publish flow
- `/dashboard` — authenticated dashboard
- `/u/:slug` — public portfolio

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open `http://localhost:4200`.

## Environment configuration

- Development API base URL lives in `src/environments/environment.ts` and defaults to `http://localhost:8081/api`.
- Production builds use `src/environments/environment.prod.ts` and default to `/api`, which works cleanly behind a reverse proxy.
- Update those files if your backend is hosted elsewhere.

## Backend integration

The frontend expects a backend that supports the MVP flow:

- `POST /resumes/upload`
- `POST /resumes/{resumeUploadId}/parse`
- `GET /profiles/{profileId}`
- `PATCH /profiles/{profileId}`
- `POST /profiles/{profileId}/publish`
- `POST /profiles/{profileId}/republish`
- `GET /profiles`
- `GET /public/{slug}`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `GET /slugs/check?value=...`

For anonymous draft ownership, the frontend can persist an optional `draftAccessToken` returned by the backend and sends it back as `X-Draft-Access-Token` on draft-related requests.
