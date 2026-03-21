import { Component } from '@angular/core';
import { AppShellComponent } from './core/layout/app-shell.component';

@Component({
  selector: 'r2s-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `<r2s-app-shell></r2s-app-shell>`
})
export class AppComponent {}
