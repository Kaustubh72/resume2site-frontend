import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'r2s-landing-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container hero">
      <div>
        <span class="badge">Resume-first portfolio publishing</span>
        <h1>Turn a resume into a portfolio site before asking users to sign up.</h1>
        <p>
          This Angular foundation keeps the MVP focused on upload → editable draft → template preview → publish.
        </p>
        <div class="actions">
          <a class="primary" routerLink="/upload">Start with resume upload</a>
          <a class="secondary" routerLink="/templates/demo-draft">See template flow</a>
        </div>
      </div>
      <aside class="card section-shell">
        <h2>MVP route map</h2>
        <ul>
          <li>Landing</li>
          <li>Upload flow</li>
          <li>Draft editor</li>
          <li>Template gallery & preview</li>
          <li>Auth at publish time</li>
          <li>Dashboard</li>
          <li>Public route at /u/:slug</li>
        </ul>
      </aside>
    </section>
  `,
  styles: [`
    .hero { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; align-items: start; padding-top: 2rem; }
    h1 { font-size: clamp(2.5rem, 4vw, 4.5rem); line-height: 1; margin: 1rem 0; letter-spacing: -0.05em; }
    p { color: var(--text-muted); font-size: 1.1rem; max-width: 60ch; }
    .actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; }
    .primary, .secondary { padding: 0.95rem 1.25rem; border-radius: 14px; font-weight: 700; }
    .primary { background: var(--primary); color: white; }
    .secondary { border: 1px solid var(--border); background: var(--surface); }
    ul { padding-left: 1.2rem; margin: 1rem 0 0; color: var(--text-muted); }
    @media (max-width: 900px) { .hero { grid-template-columns: 1fr; } }
  `]
})
export class LandingPageComponent {}
