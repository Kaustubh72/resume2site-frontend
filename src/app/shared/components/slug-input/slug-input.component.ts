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
        {{ isChecking ? 'Checking availability…' : feedback }}
      </small>
    </label>
  `,
  styleUrl: './slug-input.component.scss'
})
export class SlugInputComponent {
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() feedback = 'Choose a short public URL for your portfolio.';
  @Input() available: boolean | null = null;
  @Input() isChecking = false;
}
