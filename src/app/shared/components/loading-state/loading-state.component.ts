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
  styles: [`
    .state { display: grid; grid-template-columns: auto 1fr; gap: 1rem; padding: 1rem 1.25rem; align-items: center; }
    .spinner { width: 20px; height: 20px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--primary); animation: spin 1s linear infinite; }
    p { margin: 0.25rem 0 0; color: var(--text-muted); }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingStateComponent {
  @Input() title = 'Loading';
  @Input() message = 'Please wait while we prepare your workspace.';
}
