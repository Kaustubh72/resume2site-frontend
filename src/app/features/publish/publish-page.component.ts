import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { DraftProfile } from '../../core/models/profile.model';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { SlugInputComponent } from '../../shared/components/slug-input/slug-input.component';

@Component({
  selector: 'r2s-publish-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SlugInputComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="container page-grid publish-page">
      <div class="page-header">
        <div>
          <span class="badge">Step 4</span>
          <h1>Publish your portfolio</h1>
          <p>Preview stays open before login. We only ask for authentication when you’re ready to claim your public URL.</p>
        </div>
        <a class="badge" [routerLink]="['/templates', profileId]">Back to templates</a>
      </div>

      <r2s-loading-state *ngIf="isLoadingProfile()" title="Loading your draft" message="We’re preparing your current draft so you can publish without losing context." />
      <r2s-error-state *ngIf="profileError()" title="We couldn’t load this draft" [message]="profileError()!" />

      <ng-container *ngIf="!isLoadingProfile() && !profileError() && profile() as draft">
        <section class="card section-shell publish-summary">
          <div>
            <span class="badge">Ready to publish</span>
            <h2>{{ draft.fullName }}</h2>
            <p>{{ draft.headline }}</p>
          </div>
          <dl>
            <div>
              <dt>Template</dt>
              <dd>{{ draft.selectedTemplate | titlecase }}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{{ draft.status | titlecase }}</dd>
            </div>
          </dl>
        </section>

        <section *ngIf="!isPublished(); else publishSuccess" class="publish-grid">
          <article *ngIf="!authSession.isAuthenticated(); else slugStep" class="card section-shell auth-card">
            <div class="section-copy">
              <span class="badge">Publish-time auth</span>
              <h2>Sign up or log in to publish</h2>
              <p>Your draft stays intact. Authenticate once, then we’ll continue directly to slug selection.</p>
            </div>

            <div class="auth-toggle" role="tablist" aria-label="Authentication mode">
              <button type="button" class="toggle-pill" [class.active]="authMode() === 'signup'" (click)="setAuthMode('signup')">Sign up</button>
              <button type="button" class="toggle-pill" [class.active]="authMode() === 'login'" (click)="setAuthMode('login')">Log in</button>
            </div>

            <form [formGroup]="authForm" class="auth-form" (ngSubmit)="submitAuth()">
              <label>
                <span>Email</span>
                <input type="email" formControlName="email" placeholder="you@example.com" />
              </label>

              <label>
                <span>Password</span>
                <input type="password" formControlName="password" placeholder="Create a password" />
              </label>

              <p *ngIf="authError()" class="error-message">{{ authError() }}</p>

              <button type="submit" class="primary-button" [disabled]="authForm.invalid || isSubmittingAuth()">
                {{ isSubmittingAuth() ? 'Please wait…' : authMode() === 'signup' ? 'Create account and continue' : 'Log in and continue' }}
              </button>
            </form>
          </article>

          <ng-template #slugStep>
            <article class="card section-shell slug-card">
              <div class="section-copy">
                <span class="badge">Final step</span>
                <h2>Choose your public slug</h2>
                <p>Pick the path for your live portfolio. We’ll check availability before publishing.</p>
              </div>

              <form [formGroup]="publishForm" class="publish-form" (ngSubmit)="publishPortfolio()">
                <r2s-slug-input
                  [control]="slugControl"
                  [feedback]="slugFeedback()"
                  [available]="slugAvailable()"
                  [isChecking]="isCheckingSlug()"
                />

                <div *ngIf="slugSuggestions().length" class="suggestions">
                  <span>Suggestions</span>
                  <div class="suggestion-list">
                    <button type="button" class="suggestion-pill" *ngFor="let suggestion of slugSuggestions()" (click)="applySuggestion(suggestion)">
                      {{ suggestion }}
                    </button>
                  </div>
                </div>

                <p *ngIf="publishError()" class="error-message">{{ publishError() }}</p>

                <div class="publish-actions">
                  <button type="submit" class="primary-button" [disabled]="publishForm.invalid || slugAvailable() !== true || isPublishing()">
                    {{ isPublishing() ? 'Publishing…' : 'Publish portfolio' }}
                  </button>
                  <button type="button" class="secondary-button" (click)="logout()">Use another account</button>
                </div>
              </form>
            </article>
          </ng-template>
        </section>

        <ng-template #publishSuccess>
          <section class="card section-shell success-card">
            <span class="badge">Published</span>
            <h2>Your portfolio is live</h2>
            <p>Share your new public URL or jump into the dashboard when you’re ready to manage it later.</p>

            <div class="success-link-row">
              <a class="published-link" [href]="publishedUrl()" target="_blank" rel="noreferrer">{{ publishedUrl() }}</a>
              <button type="button" class="secondary-button" (click)="copyPublicUrl()">{{ copyCtaLabel() }}</button>
            </div>

            <p *ngIf="copyFeedback()" class="copy-feedback">{{ copyFeedback() }}</p>

            <div class="publish-actions">
              <a class="primary-button" [href]="publishedUrl()" target="_blank" rel="noreferrer">View my portfolio</a>
              <a class="secondary-button link-button" routerLink="/dashboard">Go to dashboard</a>
            </div>
          </section>
        </ng-template>
      </ng-container>
    </section>
  `,
  styles: [`
    .publish-page { padding: 1rem 0 3rem; }
    h1, h2, p, dl, dt, dd { margin: 0; }
    .publish-summary, .auth-card, .slug-card, .success-card, .publish-form, .auth-form { display: grid; gap: 1rem; }
    .publish-summary { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); align-items: end; }
    .publish-summary p, .section-copy p, .copy-feedback { color: var(--text-muted); }
    dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    dt { font-size: 0.85rem; color: var(--text-muted); }
    dd { font-weight: 700; margin-top: 0.25rem; }
    .publish-grid { display: grid; }
    .auth-toggle, .publish-actions, .suggestion-list, .success-link-row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .toggle-pill, .suggestion-pill {
      border: 1px solid var(--border); background: white; color: var(--text); padding: 0.8rem 1rem; border-radius: 999px; font-weight: 700;
    }
    .toggle-pill.active { background: var(--primary); border-color: var(--primary); color: white; }
    .auth-form label, .publish-form label { display: grid; gap: 0.45rem; }
    input {
      min-height: 52px; border-radius: 14px; border: 1px solid var(--border); padding: 0 1rem; background: white; color: var(--text);
    }
    .error-message { color: var(--danger); }
    .suggestions { display: grid; gap: 0.75rem; }
    .published-link { font-weight: 700; color: var(--primary); word-break: break-all; }
    .success-link-row { justify-content: space-between; }
    @media (max-width: 768px) {
      dl { grid-template-columns: 1fr; }
      .success-link-row { align-items: flex-start; }
    }
  `]
})
export class PublishPageComponent {
  private readonly route = inject(ActivatedRoute);
    private readonly profileApi = inject(ProfileApiService);
  protected readonly authSession = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected readonly authForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] })
  });
  protected readonly publishForm = new FormGroup({
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), Validators.minLength(3), Validators.maxLength(40)]
    })
  });

  protected readonly profile = signal<DraftProfile | null>(null);
  protected readonly isLoadingProfile = signal(true);
  protected readonly profileError = signal<string | null>(null);
  protected readonly authMode = signal<'signup' | 'login'>('signup');
  protected readonly isSubmittingAuth = signal(false);
  protected readonly authError = signal<string | null>(null);
  protected readonly slugAvailable = signal<boolean | null>(null);
  protected readonly isCheckingSlug = signal(false);
  protected readonly slugSuggestions = signal<string[]>([]);
  protected readonly publishError = signal<string | null>(null);
  protected readonly isPublishing = signal(false);
  protected readonly publishedSlug = signal<string | null>(null);
  protected readonly copyFeedback = signal<string | null>(null);
  protected readonly copyCtaLabel = signal('Copy link');
  protected readonly isPublished = computed(() => !!this.publishedSlug());
  protected readonly publishedUrl = computed(() => {
    const slug = this.publishedSlug();
    return slug ? `${window.location.origin}/u/${slug}` : '';
  });
  protected readonly slugControl = this.publishForm.controls.slug;
  protected readonly slugFeedback = computed(() => {
    const control = this.slugControl;
    if (!control.value) {
      return 'Use lowercase letters, numbers, and hyphens only.';
    }
    if (control.hasError('pattern')) {
      return 'Only lowercase letters, numbers, and single hyphens are allowed.';
    }
    if (control.hasError('minlength')) {
      return 'Use at least 3 characters.';
    }
    if (control.hasError('maxlength')) {
      return 'Use 40 characters or fewer.';
    }
    if (this.isCheckingSlug()) {
      return 'Checking availability…';
    }
    if (this.slugAvailable() === true) {
      return 'Available. This public URL is ready to publish.';
    }
    if (this.slugAvailable() === false) {
      return 'That slug is taken. Try one of the suggestions below.';
    }
    return 'We’ll check this slug as you type.';
  });

  constructor() {
    this.loadProfile();
    this.setupSlugValidation();
  }

  protected setAuthMode(mode: 'signup' | 'login'): void {
    this.authMode.set(mode);
    this.authError.set(null);
  }

  protected submitAuth(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.authError.set(null);
    this.isSubmittingAuth.set(true);

    const payload = this.authForm.getRawValue();
    const request$ = this.authMode() === 'signup'
      ? this.authApi.signup(payload)
      : this.authApi.login(payload);

    request$.pipe(
      finalize(() => this.isSubmittingAuth.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ token }) => {
        this.authSession.setToken(token);
        this.seedSlugFromProfile();
      },
      error: () => {
        this.authError.set(this.authMode() === 'signup'
          ? 'We couldn’t create your account right now. Please try again.'
          : 'We couldn’t log you in. Check your email and password and try again.');
      }
    });
  }

  protected applySuggestion(slug: string): void {
    this.slugControl.setValue(slug);
  }

  protected publishPortfolio(): void {
    if (this.publishForm.invalid || this.slugAvailable() !== true || !this.profile()) {
      this.publishForm.markAllAsTouched();
      return;
    }

    this.publishError.set(null);
    this.isPublishing.set(true);

    this.profileApi.publishPortfolio(this.profileId, { slug: this.slugControl.getRawValue() }).pipe(
      finalize(() => this.isPublishing.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ slug, publicUrl }) => {
        this.publishedSlug.set(slug);
        if (publicUrl) {
          this.publishedSlug.set(publicUrl.split('/u/').pop() ?? slug);
        }
      },
      error: () => {
        this.publishError.set('We couldn’t publish just yet. Please retry after confirming the slug is still available.');
      }
    });
  }

  protected logout(): void {
    this.authSession.clearToken();
    this.slugAvailable.set(null);
    this.publishError.set(null);
  }

  protected async copyPublicUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.publishedUrl());
      this.copyCtaLabel.set('Copied!');
      this.copyFeedback.set('Public URL copied to your clipboard.');
    } catch {
      this.copyFeedback.set('Copy failed. Please copy the URL manually.');
    }
  }

  private loadProfile(): void {
    this.profileApi.getDraft(this.profileId).pipe(
      finalize(() => this.isLoadingProfile.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.seedSlugFromProfile();
      },
      error: () => {
        this.profileError.set('Open the draft editor first, then return here to publish your portfolio.');
      }
    });
  }

  private setupSlugValidation(): void {
    this.slugControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.publishError.set(null);
      this.slugSuggestions.set([]);

      if (!value || this.slugControl.invalid) {
        this.slugAvailable.set(null);
        return;
      }

      this.isCheckingSlug.set(true);
      this.profileApi.checkSlugAvailability(value).pipe(
        finalize(() => this.isCheckingSlug.set(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: ({ available, suggestions }) => {
          this.slugAvailable.set(available);
          this.slugSuggestions.set(available ? [] : (suggestions?.length ? suggestions : this.buildSlugSuggestions(value)));
        },
        error: () => {
          this.slugAvailable.set(null);
          this.publishError.set('We couldn’t check slug availability. Please try again.');
        }
      });
    });
  }

  private seedSlugFromProfile(): void {
    if (this.slugControl.value || !this.profile()) {
      return;
    }

    const suggestedSlug = this.slugify(this.profile()!.fullName);
    this.slugControl.setValue(suggestedSlug);
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);
  }

  private buildSlugSuggestions(baseSlug: string): string[] {
    return [
      `${baseSlug}-dev`,
      `${baseSlug}-portfolio`,
      `${baseSlug}-${new Date().getUTCFullYear()}`
    ].slice(0, 3);
  }
}
