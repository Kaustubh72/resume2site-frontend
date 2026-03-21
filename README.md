# Resume2Site Frontend MVP Foundation

Angular frontend foundation for the Resume2Site MVP: a resume-first flow that lets users upload a resume, review an editable draft, preview portfolio templates before login, and publish to a public route like `/u/:slug`.

## What is included

- Angular standalone-component project structure
- Feature-based routing for landing, upload, draft editor, templates, auth, publish, dashboard, and public profile pages
- Shared structured profile model for draft and public portfolio rendering
- API service layer using `HttpClient`
- Reusable UI foundation components:
  - file upload
  - loading / error / empty states
  - section editor shell
  - template card
  - slug input
  - public profile section shell
- Environment config for API base URL

## Project structure

```text
src/app/
  core/       # app config, models, services, guards, layout
  features/   # route-level feature pages
  shared/     # reusable presentation components
```

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm start
   ```
3. Open `http://localhost:4200`.

## Notes

- This foundation intentionally stops before full backend wiring and detailed feature implementation.
- Authentication is kept out of the upload and preview flow to match the product requirement that users see value before signup.
- Public portfolio pages are intended to be dynamically rendered from API data rather than statically generated.

## Recommended next step

Continue with **Landing + upload flow** implementation next, including real upload API wiring, file validation, and draft creation handoff.
