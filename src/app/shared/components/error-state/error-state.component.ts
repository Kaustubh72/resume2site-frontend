import { Component, Input } from '@angular/core';

@Component({
  selector: 'r2s-error-state',
  standalone: true,
  template: `
    <div class="state card">
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`.state { padding: 1rem 1.25rem; border-color: rgba(185, 28, 28, 0.2); } p { margin: 0.4rem 0 0; color: var(--danger); }`]
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'Please try again.';
}
