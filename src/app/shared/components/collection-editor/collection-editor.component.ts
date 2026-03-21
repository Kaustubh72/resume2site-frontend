import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface CollectionEditorField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'date';
  placeholder?: string;
}

@Component({
  selector: 'r2s-collection-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card section-shell collection-section">
      <div class="section-top">
        <div>
          <div class="section-title-row">
            <h2>{{ title }}</h2>
            <span class="badge">{{ formArray.length }} item{{ formArray.length === 1 ? '' : 's' }}</span>
          </div>
          <p>{{ description }}</p>
        </div>
        <div class="section-actions">
          <label class="toggle-row">
            <input type="checkbox" [checked]="visible" (change)="visibleChange.emit($any($event.target).checked)" />
            <span>Show section</span>
          </label>
          <button type="button" class="secondary-button" (click)="add.emit()">Add {{ addLabel }}</button>
        </div>
      </div>

      <div class="item-list" *ngIf="formArray.length; else emptyState">
        <article class="item-card" *ngFor="let group of groups; index as index" [formGroup]="group">
          <div class="item-header">
            <strong>{{ itemLabel }} {{ index + 1 }}</strong>
            <button type="button" class="text-button danger-text" (click)="remove.emit(index)">Remove</button>
          </div>

          <div class="item-grid">
            <label class="field" *ngFor="let field of fields">
              <span>{{ field.label }}</span>
              <textarea
                *ngIf="field.type === 'textarea'; else inputField"
                [formControlName]="field.key"
                [placeholder]="field.placeholder || ''"
                rows="4"
              ></textarea>
              <ng-template #inputField>
                <input
                  [type]="field.type || 'text'"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                />
              </ng-template>
            </label>
          </div>
        </article>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <p>No {{ title.toLowerCase() }} added yet.</p>
          <button type="button" class="secondary-button" (click)="add.emit()">Add {{ addLabel }}</button>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    .collection-section, .item-list { display: grid; gap: 1rem; }
    .section-top, .item-header, .section-title-row, .section-actions { display: flex; gap: 1rem; }
    .section-top, .item-header { justify-content: space-between; align-items: flex-start; }
    .section-actions { align-items: center; flex-wrap: wrap; justify-content: flex-end; }
    .section-title-row { align-items: center; }
    .section-top h2, .section-top p { margin: 0; }
    .section-top p { margin-top: 0.5rem; color: var(--text-muted); max-width: 60ch; }
    .item-card { border: 1px solid var(--border); border-radius: 16px; padding: 1rem; background: #fcfcff; }
    .item-grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top: 1rem; }
    .field { display: grid; gap: 0.45rem; }
    .field span { font-size: 0.92rem; font-weight: 600; }
    .empty-state { display: grid; gap: 0.75rem; padding: 1rem; border: 1px dashed var(--border); border-radius: 16px; }
    .empty-state p { margin: 0; color: var(--text-muted); }
    .toggle-row { display: inline-flex; gap: 0.5rem; align-items: center; font-weight: 600; color: var(--text-muted); }
    @media (max-width: 768px) {
      .section-top, .item-header { flex-direction: column; }
      .section-actions { justify-content: flex-start; }
    }
  `]
})
export class CollectionEditorComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) itemLabel = 'Item';
  @Input({ required: true }) addLabel = 'item';
  @Input({ required: true }) fields: CollectionEditorField[] = [];
  @Input({ required: true }) formArray!: FormArray<FormGroup<any>>;
  @Input() visible = true;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<number>();
  @Output() visibleChange = new EventEmitter<boolean>();

  get groups(): FormGroup<any>[] {
    return this.formArray.controls;
  }
}
