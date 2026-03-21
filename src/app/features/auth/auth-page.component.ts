import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'r2s-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="container page-grid auth-page">
      <div class="page-header">
        <div>
          <span class="badge">Auth at publish time</span>
          <h1>Log in or sign up</h1>
          <p>Use this route when a protected area needs authentication. Preview and draft editing still stay outside the login wall.</p>
        </div>
        <a class="badge" routerLink="/">Back to landing</a>
      </div>

      <article class="card section-shell auth-card">
        <div class="auth-toggle">
          <button type="button" class="toggle-pill" [class.active]="mode() === 'signup'" (click)="setMode('signup')">Sign up</button>
          <button type="button" class="toggle-pill" [class.active]="mode() === 'login'" (click)="setMode('login')">Log in</button>
        </div>

        <form [formGroup]="form" class="auth-form" (ngSubmit)="submit()">
          <label>
            <span>Email</span>
            <input type="email" formControlName="email" placeholder="you@example.com" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" formControlName="password" placeholder="Enter your password" />
          </label>

          <p *ngIf="error()" class="error-message">{{ error() }}</p>

          <button type="submit" class="primary-button" [disabled]="form.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Please wait…' : mode() === 'signup' ? 'Create account' : 'Log in' }}
          </button>
        </form>
      </article>
    </section>
  `,
  styles: [`
    .auth-card, .auth-form { display: grid; gap: 1rem; }
    .auth-toggle { display: flex; gap: 0.75rem; }
    .toggle-pill { border: 1px solid var(--border); background: white; color: var(--text); padding: 0.8rem 1rem; border-radius: 999px; font-weight: 700; }
    .toggle-pill.active { background: var(--primary); border-color: var(--primary); color: white; }
    .auth-form label { display: grid; gap: 0.45rem; }
    input { min-height: 52px; border-radius: 14px; border: 1px solid var(--border); padding: 0 1rem; background: white; }
    .error-message { color: var(--danger); }
  `]
})
export class AuthPageComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] })
  });
  protected readonly mode = signal<'signup' | 'login'>('login');
  protected readonly isSubmitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected setMode(mode: 'signup' | 'login'): void {
    this.mode.set(mode);
    this.error.set(null);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.isSubmitting.set(true);

    const request$ = this.mode() === 'signup'
      ? this.authApi.signup(this.form.getRawValue())
      : this.authApi.login(this.form.getRawValue());

    request$.pipe(
      finalize(() => this.isSubmitting.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ token }) => {
        this.authSession.setToken(token);
        void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('next') || '/dashboard');
      },
      error: () => {
        this.error.set('Authentication failed. Please try again.');
      }
    });
  }
}
