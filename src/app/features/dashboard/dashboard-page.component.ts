import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'r2s-dashboard-page',
  standalone: true,
  imports: [EmptyStateComponent, RouterLink],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Post-publish management</span>
          <h1>Dashboard shell</h1>
          <p>Users will manage published portfolios, switch templates, and republish from here.</p>
        </div>
        <a class="badge" routerLink="/upload">Create another draft</a>
      </div>

      <r2s-empty-state title="No portfolios wired yet" message="This dashboard foundation is ready for authenticated portfolio listing in a later step." />
    </section>
  `
})
export class DashboardPageComponent {}
