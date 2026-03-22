import { Component, Input } from '@angular/core';

@Component({
  selector: 'r2s-loading-state',
  standalone: true,
  template: `
    <div class="state card">
      <div class="spinner" aria-hidden="true"></div>
      <div>
        <strong>{{ title }}</strong>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styleUrl: './loading-state.component.scss'
})
export class LoadingStateComponent {
  @Input() title = 'Loading';
  @Input() message = 'Please wait while we prepare your workspace.';
}
