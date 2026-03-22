import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { DraftProfile, PortfolioTemplateId, TemplateDefinition } from '../../core/models/profile.model';
import { APP_PATHS } from '../../core/constants/app.constants';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'r2s-dashboard-page',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, RouterLink],
  template: `
    <section class="container page-grid dashboard-page">
      <div class="page-header">
        <div>
          <span class="badge">Dashboard</span>
          <h1>Manage your published portfolios</h1>
          <p>Edit the same structured profile, switch templates, republish changes, and keep track of the current public URL.</p>
        </div>
        <a class="badge" routerLink="/upload">Create another draft</a>
      </div>

      <r2s-loading-state
        *ngIf="isLoading"
        title="Loading your portfolios"
        message="We’re fetching your saved Resume2Site profiles and available templates."
      ></r2s-loading-state>

      <r2s-error-state
        *ngIf="loadError"
        title="We couldn’t load the dashboard"
        [message]="loadError"
      ></r2s-error-state>

      <ng-container *ngIf="!isLoading && !loadError">
        <r2s-empty-state
          *ngIf="!profiles.length"
          title="No portfolios yet"
          message="Once you publish a profile, it will appear here so you can edit it later and republish updates."
        ></r2s-empty-state>

        <div *ngIf="profiles.length" class="dashboard-grid">
          <section class="card section-shell dashboard-overview">
            <div>
              <span class="badge">Portfolio management</span>
              <h2>{{ profiles.length }} profile{{ profiles.length === 1 ? '' : 's' }} in your dashboard</h2>
              <p>The UI supports multiple profiles, while this MVP can still work with a single primary portfolio.</p>
            </div>
            <div class="overview-stats">
              <div>
                <span class="meta-label">Published</span>
                <strong>{{ publishedCount }}</strong>
              </div>
              <div>
                <span class="meta-label">Needs publish</span>
                <strong>{{ draftCount }}</strong>
              </div>
            </div>
          </section>

          <article class="card section-shell profile-card" *ngFor="let profile of profiles; trackBy: trackByProfileId">
            <div class="profile-card__header">
              <div>
                <div class="title-row">
                  <h2>{{ profile.fullName }}</h2>
                  <span class="badge status-badge" [class.status-badge--draft]="profile.status !== 'published'">
                    {{ profile.status === 'published' ? 'Live' : 'Draft' }}
                  </span>
                </div>
                <p>{{ profile.headline }}</p>
              </div>

              <div class="profile-meta">
                <div>
                  <span class="meta-label">Template</span>
                  <strong>{{ getTemplateName(profile.selectedTemplate) }}</strong>
                </div>
                <div>
                  <span class="meta-label">Last updated</span>
                  <strong>{{ formatUpdatedAt(profile.updatedAt) }}</strong>
                </div>
              </div>
            </div>

            <div class="profile-card__body">
              <div class="card-block">
                <span class="meta-label">Current public URL</span>
                <ng-container *ngIf="profile.slug; else unpublishedUrl">
                  <a class="public-url" [routerLink]="['/u', profile.slug]">{{ getPublicUrl(profile.slug) }}</a>
                </ng-container>
                <ng-template #unpublishedUrl>
                  <p class="muted-copy">This profile is not published yet. Publish it to claim a public URL.</p>
                </ng-template>
              </div>

              <div class="card-block">
                <div class="block-head">
                  <div>
                    <span class="meta-label">Selected template</span>
                    <p class="muted-copy">Switch templates without changing the underlying structured profile data.</p>
                  </div>
                </div>

                <div class="template-switcher" role="group" [attr.aria-label]="'Template switcher for ' + profile.fullName">
                  <button
                    *ngFor="let template of templates"
                    type="button"
                    class="toggle-pill"
                    [class.active]="template.id === profile.selectedTemplate"
                    [disabled]="isUpdatingTemplate(profile.id)"
                    (click)="switchTemplate(profile, template.id)"
                  >
                    {{ template.name }}
                  </button>
                </div>
              </div>

              <div class="action-grid">
                <a class="secondary-button link-button" [routerLink]="['/draft', profile.id]">Edit</a>
                <a class="secondary-button link-button" [routerLink]="['/templates', profile.id, 'preview', profile.selectedTemplate]">Preview</a>
                <button type="button" class="primary-button" [disabled]="isRepublishing(profile.id) || !profile.slug" (click)="republish(profile)">
                  {{ isRepublishing(profile.id) ? 'Republishing…' : 'Republish' }}
                </button>
                <a
                  class="secondary-button link-button"
                  *ngIf="profile.slug"
                  [routerLink]="['/u', profile.slug]"
                >
                  View public page
                </a>
              </div>

              <div class="feedback-stack">
                <p *ngIf="templateMessages[profile.id]" class="success-message">{{ templateMessages[profile.id] }}</p>
                <p *ngIf="actionErrors[profile.id]" class="error-message">{{ actionErrors[profile.id] }}</p>
                <p *ngIf="republishMessages[profile.id]" class="success-message">{{ republishMessages[profile.id] }}</p>
              </div>
            </div>
          </article>
        </div>
      </ng-container>
    </section>
  `,
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly profileApi = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected profiles: DraftProfile[] = [];
  protected templates: TemplateDefinition[] = [];
  protected isLoading = true;
  protected loadError: string | null = null;
  protected readonly templateMessages: Record<string, string> = {};
  protected readonly republishMessages: Record<string, string> = {};
  protected readonly actionErrors: Record<string, string> = {};
  protected readonly updatingTemplateIds = new Set<string>();
  protected readonly republishingIds = new Set<string>();

  constructor() {
    this.loadDashboard();
  }

  protected get publishedCount(): number {
    return this.profiles.filter((profile) => profile.status === 'published').length;
  }

  protected get draftCount(): number {
    return this.profiles.length - this.publishedCount;
  }

  protected trackByProfileId(_: number, profile: DraftProfile): string {
    return profile.id;
  }

  protected getTemplateName(templateId: PortfolioTemplateId): string {
    return this.templates.find((template) => template.id === templateId)?.name ?? templateId;
  }

  protected getPublicUrl(slug: string): string {
    return `${window.location.origin}${APP_PATHS.publicPortfolioBase}/${slug}`;
  }

  protected formatUpdatedAt(updatedAt?: string): string {
    if (!updatedAt) {
      return 'Recently created';
    }

    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) {
      return updatedAt;
    }

    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  protected isUpdatingTemplate(profileId: string): boolean {
    return this.updatingTemplateIds.has(profileId);
  }

  protected isRepublishing(profileId: string): boolean {
    return this.republishingIds.has(profileId);
  }

  protected switchTemplate(profile: DraftProfile, templateId: PortfolioTemplateId): void {
    if (profile.selectedTemplate === templateId || this.isUpdatingTemplate(profile.id)) {
      return;
    }

    this.clearMessages(profile.id);
    this.updatingTemplateIds.add(profile.id);

    this.profileApi.updateDraft(profile.id, { selectedTemplate: templateId }).pipe(
      finalize(() => this.updatingTemplateIds.delete(profile.id)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedProfile) => {
        this.replaceProfile(updatedProfile);
        this.templateMessages[profile.id] = `${this.getTemplateName(templateId)} is now selected for the next preview or republish.`;
      },
      error: () => {
        this.actionErrors[profile.id] = 'We could not update the template. Please try again.';
      }
    });
  }

  protected republish(profile: DraftProfile): void {
    if (!profile.slug || this.isRepublishing(profile.id)) {
      return;
    }

    this.clearMessages(profile.id);
    this.republishingIds.add(profile.id);

    this.profileApi.publishPortfolio(profile.id, { slug: profile.slug }).pipe(
      finalize(() => this.republishingIds.delete(profile.id)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        const slug = profile.slug ?? '';
        const updatedProfile: DraftProfile = {
          ...profile,
          status: 'published',
          updatedAt: new Date().toISOString()
        };
        this.replaceProfile(updatedProfile);
        this.republishMessages[profile.id] = `Republished successfully. Your live page is still available at ${this.getPublicUrl(slug)}.`;
      },
      error: () => {
        this.actionErrors[profile.id] = 'Republish failed. Please try again.';
      }
    });
  }

  private loadDashboard(): void {
    forkJoin({
      profiles: this.profileApi.getDashboardProfiles(),
      templates: this.profileApi.getTemplates()
    }).pipe(
      finalize(() => this.isLoading = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ profiles, templates }) => {
        this.profiles = profiles;
        this.templates = templates;
      },
      error: () => {
        this.loadError = 'Please reload the page. If the problem continues, log in again and reopen the dashboard.';
      }
    });
  }

  private replaceProfile(updatedProfile: DraftProfile): void {
    this.profiles = this.profiles.map((profile) => profile.id === updatedProfile.id ? updatedProfile : profile);
  }

  private clearMessages(profileId: string): void {
    delete this.templateMessages[profileId];
    delete this.republishMessages[profileId];
    delete this.actionErrors[profileId];
  }
}
