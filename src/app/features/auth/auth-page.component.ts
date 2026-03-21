import { Component } from '@angular/core';

@Component({
  selector: 'r2s-auth-page',
  standalone: true,
  template: `
    <section class="container page-grid auth-page">
      <div class="page-header">
        <div>
          <span class="badge">Auth at publish time</span>
          <h1>Authentication shell</h1>
          <p>This route is intentionally separate from upload and preview to preserve the product's value-first flow.</p>
        </div>
      </div>

      <article class="card section-shell">
        <h2>Login / signup placeholder</h2>
        <p>The next auth step can implement reactive forms without changing the route structure.</p>
      </article>
    </section>
  `,
  styles: [`.auth-page h2, .auth-page p { margin: 0; } .auth-page p { color: var(--text-muted); margin-top: 0.5rem; }`]
})
export class AuthPageComponent {}
