import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

@Component({
  selector: 'r2s-app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="shell__header">
        <div class="container shell__header-inner">
          <a class="brand" routerLink="/">Resume2Site</a>
          <nav class="shell__nav">
            <a routerLink="/upload" routerLinkActive="active">Upload</a>
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <button *ngIf="authSession.isAuthenticated()" type="button" class="logout-button" (click)="logout()">Log out</button>
          </nav>
        </div>
      </header>

      <main class="shell__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  protected readonly authSession = inject(AuthSessionService);

  protected logout(): void {
    this.authSession.clearToken();
  }
}
