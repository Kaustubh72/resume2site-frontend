import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DraftProfile, PortfolioTemplateId } from '../../core/models/profile.model';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { TemplateRendererComponent } from '../../shared/components/template-renderer/template-renderer.component';

@Component({
  selector: 'r2s-public-profile-page',
  standalone: true,
  imports: [CommonModule, TemplateRendererComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="public-page-shell">
      <div class="container public-page">
        <r2s-loading-state
          *ngIf="isLoading"
          title="Loading portfolio"
          message="We’re fetching the public profile and selected template."
        />

        <ng-container *ngIf="!isLoading">
          <r2s-error-state
            *ngIf="state === 'not-found'"
            title="Portfolio not found"
            [message]="'We couldn’t find a published portfolio for /u/' + slug + '. Check the link or ask the owner for their latest public URL.'"
          />

          <r2s-error-state
            *ngIf="state === 'unpublished'"
            title="Portfolio unavailable"
            message="This slug exists but the portfolio is not currently published. Please check back later."
          />

          <r2s-error-state
            *ngIf="state === 'error'"
            title="We couldn’t load this portfolio"
            [message]="errorMessage"
          />

          <ng-container *ngIf="state === 'ready' && publicProfile">
            <header class="card section-shell hero-card">
              <div class="hero-copy">
                <span class="badge">Public portfolio</span>
                <h1>{{ publicProfile.fullName }}</h1>
                <p class="hero-lead">{{ publicProfile.headline || publicProfile.summary }}</p>
                <p class="hero-summary" *ngIf="publicProfile.summary">{{ publicProfile.summary }}</p>
              </div>

              <div class="hero-meta" *ngIf="showMetaPanel(publicProfile)">
                <div *ngIf="publicProfile.location">
                  <span>Location</span>
                  <strong>{{ publicProfile.location }}</strong>
                </div>
                <div *ngIf="publicProfile.website">
                  <span>Website</span>
                  <a [href]="publicProfile.website" target="_blank" rel="noreferrer">{{ publicProfile.website }}</a>
                </div>
                <div>
                  <span>Template</span>
                  <strong>{{ selectedTemplateLabel }}</strong>
                </div>
              </div>
            </header>

            <r2s-template-renderer
              [profile]="publicProfile"
              [templateId]="resolvedTemplateId"
              device="desktop"
            />

            <footer class="portfolio-footer">
              <p>Built with Resume2Site for clean, recruiter-friendly portfolio publishing.</p>
            </footer>
          </ng-container>
        </ng-container>
      </div>
    </section>
  `,
  styleUrl: './public-profile-page.component.scss'
})
export class PublicProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileApi = inject(ProfileApiService);
  private readonly title = inject(Title);

  protected readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected publicProfile: DraftProfile | null = null;
  protected isLoading = true;
  protected errorMessage = 'Please try again in a moment.';
  protected state: 'loading' | 'ready' | 'not-found' | 'unpublished' | 'error' = 'loading';

  constructor() {
    this.loadPublicProfile();
  }

  protected get resolvedTemplateId(): PortfolioTemplateId {
    const selected = this.publicProfile?.selectedTemplate;
    return selected === 'minimal' || selected === 'spotlight' || selected === 'classic' ? selected : 'classic';
  }

  protected get selectedTemplateLabel(): string {
    return {
      classic: 'Classic',
      minimal: 'Minimal',
      spotlight: 'Spotlight'
    }[this.resolvedTemplateId];
  }

  protected showMetaPanel(profile: DraftProfile): boolean {
    return Boolean(profile.location || profile.website || this.selectedTemplateLabel);
  }

  private loadPublicProfile(): void {
    this.title.setTitle('Portfolio | Resume2Site');

    if (!this.slug.trim()) {
      this.isLoading = false;
      this.state = 'not-found';
      return;
    }

    this.profileApi.getPublicProfile(this.slug).pipe(
      finalize(() => this.isLoading = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (profile) => {
        this.publicProfile = profile;
        this.state = 'ready';
        this.title.setTitle(`${profile.fullName} | Resume2Site`);
      },
      error: (error: HttpErrorResponse) => {
        this.state = this.resolveErrorState(error);
        this.errorMessage = this.buildErrorMessage(error);
      }
    });
  }

  private resolveErrorState(error: HttpErrorResponse): 'not-found' | 'unpublished' | 'error' {
    if (error.status === 404) {
      return 'not-found';
    }

    if (error.status === 410 || error.status === 403 || error.status === 422) {
      return 'unpublished';
    }

    return 'error';
  }

  private buildErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return 'Please refresh the page or try again later.';
  }
}
