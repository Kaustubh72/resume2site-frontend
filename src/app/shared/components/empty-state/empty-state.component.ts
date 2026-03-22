import { Component, Input } from '@angular/core';

@Component({
  selector: 'r2s-empty-state',
  standalone: true,
  template: `
    <div class="state card">
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
    </div>
  `,
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'This section will populate once data is available.';
}
