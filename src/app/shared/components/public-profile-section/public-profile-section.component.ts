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
  styleUrl: './public-profile-section.component.scss'
})
export class PublicProfileSectionComponent {
  @Input() title = '';
  @Input() description = '';
}
