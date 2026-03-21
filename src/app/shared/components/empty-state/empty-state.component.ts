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
  styles: [`.state { padding: 1rem 1.25rem; } p { margin: 0.4rem 0 0; color: var(--text-muted); }`]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'This section will populate once data is available.';
}
