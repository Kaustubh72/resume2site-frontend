import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateDefinition } from '../../../core/models/profile.model';

@Component({
  selector: 'r2s-template-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="card template-card">
      <span class="badge">{{ template.accentLabel }}</span>
      <h3>{{ template.name }}</h3>
      <p>{{ template.description }}</p>
      <small>{{ template.audience }}</small>
      <a [routerLink]="previewLink" class="cta">Preview template</a>
    </article>
  `,
  styles: [`
    .template-card { display: grid; gap: 0.75rem; padding: 1.25rem; }
    h3, p, small { margin: 0; }
    p, small { color: var(--text-muted); }
    .cta { color: var(--primary); font-weight: 600; margin-top: 0.25rem; }
  `]
})
export class TemplateCardComponent {
  @Input({ required: true }) template!: TemplateDefinition;
  @Input() previewLink: string | unknown[] = ['/templates', 'demo-draft'];
}
