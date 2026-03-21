import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'r2s-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FileUploadComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="container landing-page">
      <section class="hero">
        <div class="hero__content">
          <span class="badge">Resume-first portfolio publishing</span>
          <h1>Turn your resume into a professional portfolio website in minutes.</h1>
          <p>
            Upload a PDF or DOCX, let Resume2Site create a structured draft, and preview your portfolio before any login wall.
          </p>

          <div class="hero__actions">
            <button type="button" class="primary" (click)="scrollToUpload()">Upload Resume</button>
            <a class="secondary" href="#how-it-works">Learn more</a>
          </div>

          <ul class="hero__highlights">
            <li>No login required to start</li>
            <li>Editable draft profile after parsing</li>
            <li>Preview templates before publishing</li>
          </ul>
        </div>

        <aside class="card section-shell hero__panel">
          <span class="badge">Fast MVP flow</span>
          <ol>
            <li>Upload resume</li>
            <li>Parse into draft profile</li>
            <li>Edit content</li>
            <li>Preview templates</li>
            <li>Publish with custom slug</li>
          </ol>
          <a routerLink="/upload">Prefer a dedicated upload page?</a>
        </aside>
      </section>

      <section id="upload" class="landing-upload">
        <div class="landing-upload__intro">
          <span class="badge">Start here</span>
          <h2>Upload your resume and get to the wow moment fast.</h2>
          <p>We support PDF and DOCX resumes only for this MVP flow.</p>
        </div>

        <r2s-file-upload
          [disabled]="isProcessing"
          [errorMessage]="validationError"
          (fileSelected)="handleFileUpload($event)"
          (validationError)="setValidationError($event)"
        ></r2s-file-upload>

        <r2s-loading-state
          *ngIf="isProcessing"
          title="Uploading and parsing your resume"
          message="We’re preparing your first editable portfolio draft now."
        ></r2s-loading-state>

        <r2s-error-state
          *ngIf="apiError"
          title="We couldn’t process that resume"
          [message]="apiError"
        ></r2s-error-state>
      </section>

      <section id="how-it-works" class="how-it-works">
        <article class="card section-shell">
          <h3>1. Upload once</h3>
          <p>Start with the resume you already have.</p>
        </article>
        <article class="card section-shell">
          <h3>2. Edit the draft</h3>
          <p>Every parsed field stays editable before publishing.</p>
        </article>
        <article class="card section-shell">
          <h3>3. Publish when ready</h3>
          <p>Choose a slug and publish under a public <code>/u/:slug</code> route.</p>
        </article>
      </section>
    </section>
  `,
  styles: [`
    .landing-page { display: grid; gap: 3rem; padding-top: 1.5rem; }
    .hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr); gap: 1.5rem; align-items: stretch; }
    .hero__content { padding: 1rem 0; }
    h1 { margin: 1rem 0; font-size: clamp(2.75rem, 5vw, 4.75rem); line-height: 0.97; letter-spacing: -0.06em; max-width: 12ch; }
    h2, h3 { margin: 0; }
    p { margin: 0; color: var(--text-muted); }
    .hero__content > p { font-size: 1.1rem; max-width: 62ch; }
    .hero__actions { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.75rem 0; }
    .primary, .secondary {
      min-height: 52px; padding: 0 1.2rem; border-radius: 14px; font-weight: 700; border: 0; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .primary { background: var(--primary); color: white; }
    .secondary { background: var(--surface); border: 1px solid var(--border); }
    .hero__highlights { display: grid; gap: 0.75rem; padding: 0; margin: 0; list-style: none; color: var(--text); }
    .hero__highlights li::before { content: '• '; color: var(--primary); font-weight: 800; }
    .hero__panel { display: grid; gap: 1rem; }
    .hero__panel ol { margin: 0; padding-left: 1.25rem; color: var(--text-muted); display: grid; gap: 0.6rem; }
    .hero__panel a { color: var(--primary); font-weight: 600; }
    .landing-upload { display: grid; gap: 1rem; scroll-margin-top: 6rem; }
    .landing-upload__intro { display: grid; gap: 0.5rem; }
    .how-it-works { display: grid; gap: 1rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .how-it-works article { display: grid; gap: 0.75rem; }
    @media (max-width: 960px) {
      .hero, .how-it-works { grid-template-columns: 1fr; }
      h1 { max-width: none; }
    }
  `]
})
export class LandingPageComponent {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly router = inject(Router);
  private readonly profileApi = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);

  isProcessing = false;
  validationError: string | null = null;
  apiError: string | null = null;

  scrollToUpload(): void {
    this.viewportScroller.scrollToAnchor('upload');
  }

  handleFileUpload(file: File): void {
    this.validationError = null;
    this.apiError = null;
    this.isProcessing = true;

    this.profileApi
      .uploadAndParseResume(file)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isProcessing = false;
        })
      )
      .subscribe({
        next: ({ profileId }) => {
          void this.router.navigate(['/draft', profileId]);
        },
        error: () => {
          this.apiError = 'Please try again. If the problem continues, use another PDF or DOCX resume.';
        }
      });
  }

  setValidationError(message: string): void {
    this.apiError = null;
    this.validationError = message;
  }
}
