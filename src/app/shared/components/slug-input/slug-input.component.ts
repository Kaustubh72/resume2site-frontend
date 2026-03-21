import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'r2s-slug-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <label class="slug-field">
      <span>Portfolio URL slug</span>
      <div class="slug-control">
        <span>/u/</span>
        <input [formControl]="control" placeholder="your-name">
      </div>
      <small [class.available]="available" [class.unavailable]="available === false">
        {{ feedback }}
      </small>
    </label>
  `,
  styles: [`
    .slug-field { display: grid; gap: 0.5rem; }
    .slug-control { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; align-items: center; padding: 0.85rem 1rem; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); }
    input { border: 0; outline: none; background: transparent; }
    small { color: var(--text-muted); }
    .available { color: var(--success); }
    .unavailable { color: var(--danger); }
  `]
})
export class SlugInputComponent {
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() feedback = 'Choose a short public URL for your portfolio.';
  @Input() available: boolean | null = null;
}
