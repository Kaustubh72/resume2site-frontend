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
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'Please try again.';
}
