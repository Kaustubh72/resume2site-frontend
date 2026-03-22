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
  styleUrl: './template-card.component.scss'
})
export class TemplateCardComponent {
  @Input({ required: true }) template!: TemplateDefinition;
  @Input() previewLink: string | unknown[] = ['/templates', 'demo-draft'];
  @Input() selected = false;
  @Output() readonly select = new EventEmitter<PortfolioTemplateId>();
}
