import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'r2s-public-profile-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="public-section">
      <h2>{{ title }}</h2>
      <p *ngIf="description">{{ description }}</p>
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    .public-section { display: grid; gap: 1rem; color: inherit; }
    h2, p { margin: 0; color: inherit; }
    p { color: var(--text-muted); }
  `]
})
export class PublicProfileSectionComponent {
  @Input() title = '';
  @Input() description = '';
}
