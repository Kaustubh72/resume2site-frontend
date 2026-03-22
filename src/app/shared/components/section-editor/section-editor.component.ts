import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'r2s-section-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card section-shell">
      <div class="section-header">
        <div>
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
        <span class="badge">Editable draft</span>
      </div>

      <ng-container *ngIf="items.length; else empty">
        <div class="item" *ngFor="let item of items; index as index">
          <strong>{{ itemTitle(index, item) }}</strong>
          <pre>{{ item | json }}</pre>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="empty">This section will be editable once parsing data is connected.</p>
      </ng-template>
    </section>
  `,
  styleUrl: './section-editor.component.scss'
})
export class SectionEditorComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() items: unknown[] = [];
  @Input() itemLabelKey?: string;

  itemTitle(index: number, item: unknown): string {
    if (this.itemLabelKey && typeof item === 'object' && item !== null && this.itemLabelKey in item) {
      return String((item as Record<string, unknown>)[this.itemLabelKey]);
    }

    return `${this.title} ${index + 1}`;
  }
}
