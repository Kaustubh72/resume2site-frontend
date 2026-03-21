import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicProfileSectionComponent } from '../../shared/components/public-profile-section/public-profile-section.component';

@Component({
  selector: 'r2s-public-profile-page',
  standalone: true,
  imports: [PublicProfileSectionComponent],
  template: `
    <section class="container public-page">
      <header class="card section-shell hero">
        <span class="badge">Public route</span>
        <h1>{{ slug }}</h1>
        <p>Dynamic portfolio pages will be rendered from stored structured profile data at /u/:slug.</p>
      </header>

      <r2s-public-profile-section title="About" description="Shared schema-driven summary content.">
        <div class="card section-shell">Profile summary placeholder.</div>
      </r2s-public-profile-section>

      <r2s-public-profile-section title="Experience" description="Structured experience blocks rendered dynamically.">
        <div class="card section-shell">Experience section placeholder.</div>
      </r2s-public-profile-section>
    </section>
  `,
  styles: [`.public-page { display: grid; gap: 1.5rem; } .hero h1, .hero p { margin: 0; } .hero p { color: var(--text-muted); margin-top: 0.5rem; }`]
})
export class PublicProfilePageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly slug = this.route.snapshot.paramMap.get('slug') ?? 'demo-user';
}
