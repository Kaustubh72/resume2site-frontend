# Task 1 — Frontend Foundation

## Goal
Create the frontend foundation only.

## Includes
- Angular setup
- feature-based folder structure
- route skeletons
- environment config
- shared models
- API service layer skeleton
- loading/error patterns
- README

## Prompt to Agent
Use `AGENT\_PROMPT.md` as base context, then ask:

> Build the frontend foundation only. Create the Angular project structure, route skeletons, shared models, API layer skeleton, environment config, and a concise README. Do not implement feature flows yet. Then stop and summarize.

---

# Task 2 — Landing + Upload Flow

## Goal
Let anonymous users start the product immediately.

## Includes
- landing page
- value proposition
- upload UI
- file validation
- upload + parse API integration
- loading/error states
- navigate to draft editor

## Prompt to Agent
> Implement the landing page and anonymous resume upload flow. The user must be able to upload PDF/DOCX without login, trigger backend upload + parse, and navigate to the draft editor on success. Keep it polished and simple. Then stop and summarize.

---

# Task 3 — Draft Editor

## Goal
Allow users to review and correct parsed data.

## Includes
- fetch draft profile
- top-level field editing
- list section editing
- section visibility toggles
- save flow
- continue to templates CTA

## Prompt to Agent
> Implement the draft editor using reactive forms. Support editing top-level fields and collections (skills, links, experiences, education, projects). Keep the UX practical and clean. Then stop and summarize.

---

# Task 4 — Template Gallery + Live Preview

## Goal
Deliver the core “wow moment.”

## Includes
- fetch templates
- show 3 template cards
- select template
- live preview
- template switching
- publish CTA

## Prompt to Agent
> Implement the template gallery and live preview flow. Fetch templates from the backend, let the user select among 3 templates, and render a live preview using the shared profile schema. Do not build a drag-and-drop editor. Then stop and summarize.

---

# Task 5 — Auth + Publish Flow

## Goal
Require auth only at the moment of publishing.

## Includes
- login/signup UI
- preserve draft context
- slug input UI
- slug validation + availability check
- publish API call
- success screen

## Prompt to Agent
> Implement the auth-at-publish flow. When the user clicks Publish, show login/signup if needed, preserve the draft context, then continue to slug selection and publish. Show final public URL on success. Then stop and summarize.

---

# Task 6 — Dashboard + Edit Later

## Goal
Support returning users.

## Includes
- dashboard
- show owned profile(s)
- edit existing profile
- change template
- republish
- show current public URL

## Prompt to Agent
> Implement the dashboard and edit-later flow. Reuse the editor and preview where practical. Support republish and show the current public URL. Then stop and summarize.

---

# Task 7 — Public Profile Route

## Goal
Render the final public portfolio.

## Includes
- route `/u/:slug`
- fetch public profile API
- render selected template
- loading / not-found states
- responsive polish

## Prompt to Agent
> Implement the public profile route `/u/:slug`. Fetch public profile data and render it using the selected template. Keep it professional, responsive, and recruiter-friendly. Then stop and summarize.

---

# Task 8 — UI Cleanup / Polish

## Goal
Make the frontend MVP feel strong.

## Includes
- improve empty states
- improve validation UX
- improve spacing and responsiveness
- reduce duplication
- clean README

## Prompt to Agent
> Review the frontend MVP for polish and maintainability. Improve validation UX, loading/error states, responsiveness, and component reuse. Avoid adding new features. Then stop and summarize.

---

# Agent Guardrail Reminder
At every step, remind the agent:
- stay in MVP scope
- do not overbuild
- stop after requested scope
- summarize what was done
- propose only the next logical step

