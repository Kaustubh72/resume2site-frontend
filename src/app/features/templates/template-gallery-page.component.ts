import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TemplateCardComponent } from '../../shared/components/template-card/template-card.component';
import { TemplateDefinition } from '../../core/models/profile.model';

@Component({
  selector: 'r2s-template-gallery-page',
  standalone: true,
  imports: [CommonModule, TemplateCardComponent, RouterLink],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Step 3</span>
          <h1>Template gallery foundation</h1>
          <p>Preview happens before login, and every template reads from the same draft profile shape.</p>
        </div>
        <a class="badge" [routerLink]="['/publish', profileId]">Go to publish flow</a>
      </div>

      <div class="template-grid">
        <r2s-template-card
          *ngFor="let template of templates"
          [template]="template"
          [previewLink]="['/templates', profileId, 'preview', template.id]"
        ></r2s-template-card>
      </div>
    </section>
  `,
  styles: [`.template-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }`]
})
export class TemplateGalleryPageComponent {
  profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  templates: TemplateDefinition[] = [
    { id: 'classic', name: 'Classic', description: 'Balanced profile layout.', audience: 'Students & developers', accentLabel: 'Professional' },
    { id: 'minimal', name: 'Minimal', description: 'Simple layout with strong readability.', audience: 'Software engineers', accentLabel: 'Minimal' },
    { id: 'spotlight', name: 'Spotlight', description: 'Project-forward layout.', audience: 'Project-based candidates', accentLabel: 'Project-led' }
  ];

  constructor(private readonly route: ActivatedRoute) {}
}
