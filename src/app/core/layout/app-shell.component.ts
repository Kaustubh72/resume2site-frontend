import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'r2s-app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="shell__header">
        <div class="container shell__header-inner">
          <a class="brand" routerLink="/">Resume2Site</a>
          <nav class="shell__nav">
            <a routerLink="/upload" routerLinkActive="active">Upload</a>
            <a routerLink="/draft/demo-draft" routerLinkActive="active">Draft</a>
            <a routerLink="/templates/demo-draft" routerLinkActive="active">Templates</a>
            <a routerLink="/publish/demo-draft" routerLinkActive="active">Publish</a>
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          </nav>
        </div>
      </header>

      <main class="shell__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell { min-height: 100vh; }
      .shell__header {
        position: sticky; top: 0; z-index: 10;
        border-bottom: 1px solid var(--border);
        background: rgba(246, 247, 251, 0.92);
        backdrop-filter: blur(12px);
      }
      .shell__header-inner {
        display: flex; align-items: center; justify-content: space-between;
        gap: 1rem; min-height: 72px;
      }
      .brand { font-weight: 800; letter-spacing: -0.03em; }
      .shell__nav { display: flex; flex-wrap: wrap; gap: 1rem; color: var(--text-muted); }
      .shell__nav a.active, .shell__nav a:hover { color: var(--primary); }
      .shell__content { padding: 2rem 0 4rem; }
      @media (max-width: 768px) {
        .shell__header-inner { align-items: flex-start; padding: 1rem 0; flex-direction: column; }
      }
    `
  ]
})
export class AppShellComponent {}
