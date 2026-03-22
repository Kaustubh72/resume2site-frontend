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
  styleUrl: './landing-page.component.scss'
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
          this.profileApi.rememberDraftAccess(profileId);
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
