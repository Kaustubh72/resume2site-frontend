# Resume2Site Frontend — Project Context

## Product Summary
Resume2Site is a \*\*resume-first platform\*\* that converts a user’s uploaded resume into an editable, hosted portfolio website.

This frontend repository is responsible for:
- landing page and onboarding
- anonymous resume upload flow
- draft profile editing
- template selection and live preview
- authentication at publish time
- slug selection UI
- dashboard for later editing
- public portfolio route rendering

## Core User Flow
1. User lands on the homepage
2. User sees the value proposition:
   - “Turn your resume into a professional portfolio website in minutes”
3. User uploads a resume (PDF/DOCX)
4. Frontend calls backend upload + parse APIs
5. Frontend receives a draft profile ID
6. User is taken to the draft editor
7. User reviews and edits extracted profile data
8. User selects a template
9. User previews the portfolio before login
10. User clicks Publish
11. If unauthenticated, frontend shows signup/login flow
12. After successful auth, frontend continues to slug selection
13. User chooses a custom slug
14. Frontend calls publish API
15. User receives final public URL
16. Public page is accessible at `/u/:slug`
17. User can later log in, edit, and republish

## What This Product Is
Resume2Site is:
- a \*\*resume-to-portfolio publishing platform\*\*
- not a generic website builder
- not a drag-and-drop editor
- not just a resume parser UI

## Core Product Rules (Non-Negotiable)
- Login must \*\*NOT\*\* be required before preview
- The user must see value before signup
- Resume parsing does \*\*NOT\*\* need to be perfect; UI must allow editing
- Templates must use a shared structured profile schema
- Public pages must use path-based routing: `/u/:slug`
- Public pages are dynamically rendered from API data
- Do \*\*NOT\*\* implement subdomains in MVP
- Do \*\*NOT\*\* build a drag-and-drop page builder
- Keep the UX fast, focused, and product-like

## MVP Features (Frontend-Relevant)
- Landing page
- Resume upload UI
- Upload + parse loading states
- Draft profile editor
- Template gallery
- Live preview
- Signup/login at publish time
- Slug input + availability feedback
- Publish success screen
- Dashboard for later edits
- Public profile route rendering

## Tech Stack (Frontend)
- Angular (latest stable)
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- Standalone components preferred
- SCSS / clean CSS

## UX Philosophy
- Product-focused, not admin-focused
- Fast time to value
- Minimal friction
- Clean professional SaaS feel
- Mobile responsive
- Avoid UI clutter

## What NOT To Build in This Repo (Unless Explicitly Asked)
- Drag-and-drop editor
- Rich CMS
- Advanced state libraries unless truly necessary
- Analytics dashboards
- AI writing tools
- Custom domain UI
- Subdomain management UI
- Blog builder
- Overly complex design system from day one

## Goal for This Repo
Build a polished, maintainable, recruiter-friendly frontend that makes the core resume-to-portfolio flow feel magical and easy.
