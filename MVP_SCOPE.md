## Objective
Build the frontend for the Resume2Site MVP only.

The frontend must support the full user journey from:
- landing page
- anonymous resume upload
- draft editing
- template preview
- login only at publish time
- slug selection
- publish success
- public page rendering
- later dashboard-based editing

---

# In Scope (MVP)

## 1. Frontend Foundation
- Angular project setup
- feature-based folder structure
- routing setup
- environment config for API base URL
- shared models and API service layer
- loading/error/empty state patterns
- basic README

## 2. Routes
Create routes for:
- `/` → landing page
- upload flow page or embedded flow
- draft editor route
- template gallery / preview route
- auth flow route or modal flow
- publish flow route
- dashboard route
- public route: `/u/:slug`
- not-found route

## 3. Landing + Upload Flow
- Clear product message
- Primary CTA: Upload Resume
- Accept PDF and DOCX only
- Client-side validation
- Call backend upload + parse APIs
- Show loading states
- Navigate to draft editor on success

## 4. Draft Editor
- Fetch draft profile
- Editable top-level fields:
  - fullName
  - headline
  - summary
  - email
  - phone
  - location
- Editable collections:
  - links
  - skills
  - experiences
  - education
  - projects
- Section visibility toggles
- Save updates

## 5. Template Gallery + Live Preview
- Fetch templates from backend
- Show 3 template cards
- Select template
- Render live preview
- Support switching templates without losing data
- Publish CTA

## 6. Auth at Publish Time
- Signup form
- Login form
- Preserve draft context through auth flow
- Store JWT in a practical SPA-safe MVP way
- Continue to slug selection after auth

## 7. Slug + Publish Flow
- Slug input
- Client-side slug validation
- Slug availability check
- Suggestions if taken
- Publish API call
- Show final public URL
- Copy link CTA
- “View my portfolio” CTA

## 8. Dashboard
- Show owned profile(s)
- Open profile for editing
- Reuse editor/preview where practical
- Change template
- Republish
- Show current public URL

## 9. Public Portfolio Route
- Route: `/u/:slug`
- Fetch public profile data from backend
- Render selected template dynamically
- Show loading / not-found states
- Responsive and polished

---

# Out of Scope (Do NOT Build in MVP)

## Product / UX Overbuild
- Drag-and-drop page builder
- Full WYSIWYG editor
- Blog builder
- Theme marketplace
- Multi-profile complex workspace UI unless explicitly needed
- AI writing assistant
- Analytics UI
- Custom domain UI
- Subdomain settings UI
- Billing/subscription UI
- Admin UI

## Engineering Overbuild
- NgRx or complex global state unless truly necessary
- SSR unless explicitly requested
- Overly complex design systems
- Over-abstracted UI frameworks
- Heavy third-party UI kits unless clearly beneficial

## Rendering Overbuild
- Static site export UI
- ZIP export UI
- HTML download UI

---

# UX Non-Negotiables
- User must see value before signup
- Login happens only at publish time
- The flow must feel fast and guided
- The product should feel like a professional tool, not a form-heavy admin app
- Public pages must look shareable and recruiter-friendly

---

# Definition of Done for MVP Frontend

Frontend MVP is considered complete when:
- \[ ] Landing page is clear and polished
- \[ ] User can upload PDF/DOCX and start the flow without login
- \[ ] Draft editor is usable and stable
- \[ ] Template gallery and preview work
- \[ ] Publish triggers auth only when needed
- \[ ] Slug selection works with feedback
- \[ ] Publish success screen shows final URL
- \[ ] Dashboard supports edit + republish
- \[ ] Public route `/u/:slug` renders correctly
- \[ ] Error states are handled cleanly
- \[ ] App is responsive enough for desktop + mobile
