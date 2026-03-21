import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioTemplateId, TemplateDefinition } from '../../../core/models/profile.model';

@Component({
  selector: 'r2s-template-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="card template-card" [class.selected]="selected">
      <div class="thumbnail" [ngClass]="template.id">
        <span>{{ template.thumbnailLabel || template.name }}</span>
        <div class="thumbnail-bars">
          <i></i><i></i><i></i>
        </div>
      </div>

      <div class="template-copy">
        <div class="template-meta-row">
          <span class="badge">{{ template.accentLabel }}</span>
          <span class="selected-pill" *ngIf="selected">Selected</span>
        </div>
        <h3>{{ template.name }}</h3>
        <p>{{ template.description }}</p>
        <small>{{ template.audience }}</small>
      </div>

      <ul class="highlights" *ngIf="template.highlights?.length">
        <li *ngFor="let item of template.highlights">{{ item }}</li>
      </ul>

      <div class="actions">
        <button type="button" class="primary-button" (click)="select.emit(template.id)">
          {{ selected ? 'Selected' : 'Use this template' }}
        </button>
        <a [routerLink]="previewLink" class="text-link">Open preview</a>
      </div>
    </article>
  `,
  styles: [`
    .template-card, .template-copy, .highlights { display: grid; gap: 0.85rem; }
    .template-card { padding: 1.15rem; transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
    .template-card.selected { border-color: rgba(79, 70, 229, 0.45); box-shadow: 0 24px 50px rgba(79, 70, 229, 0.15); transform: translateY(-2px); }
    .thumbnail { min-height: 160px; border-radius: 18px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; color: white; font-weight: 700; }
    .thumbnail.classic { background: linear-gradient(135deg, #4f46e5, #c7d2fe); }
    .thumbnail.minimal { background: linear-gradient(135deg, #0f172a, #475569); }
    .thumbnail.spotlight { background: linear-gradient(135deg, #2563eb, #7c3aed); }
    .thumbnail-bars { display: grid; gap: 0.5rem; }
    .thumbnail-bars i { display: block; height: 0.7rem; border-radius: 999px; background: rgba(255, 255, 255, 0.78); }
    .thumbnail-bars i:nth-child(2) { width: 82%; }
    .thumbnail-bars i:nth-child(3) { width: 64%; }
    .template-meta-row, .actions { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
    h3, p, small, ul { margin: 0; }
    p, small, li { color: var(--text-muted); }
    .selected-pill { color: var(--primary); font-weight: 700; font-size: 0.9rem; }
    .highlights { padding-left: 1rem; }
    .text-link { color: var(--primary); font-weight: 700; }
  `]
})
export class TemplateCardComponent {
  @Input({ required: true }) template!: TemplateDefinition;
  @Input() previewLink: string | unknown[] = ['/templates', 'demo-draft'];
  @Input() selected = false;
  @Output() readonly select = new EventEmitter<PortfolioTemplateId>();
}
