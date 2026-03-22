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
  styleUrl: './collection-editor.component.scss'
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
