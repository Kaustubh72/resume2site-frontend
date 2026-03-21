import { CommonModule } from '@angular/common';
import { DestroyRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'r2s-upload-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FileUploadComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="container page-grid upload-page">
      <div class="page-header">
        <div>
          <span class="badge">Resume upload</span>
          <h1>Upload your resume to generate an editable portfolio draft.</h1>
          <p>Fast, anonymous, and focused: upload, parse, and continue straight into editing.</p>
        </div>
        <a class="badge" routerLink="/">Back to landing</a>
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
        message="We’re creating your first editable profile draft."
      ></r2s-loading-state>

      <r2s-error-state
        *ngIf="apiError"
        title="We couldn’t process that resume"
        [message]="apiError"
      ></r2s-error-state>
    </section>
  `,
  styles: [`
    .upload-page { padding-top: 1rem; }
    h1 { margin: 0.5rem 0 0; font-size: clamp(2rem, 3vw, 3rem); letter-spacing: -0.04em; }
    p { margin: 0.75rem 0 0; color: var(--text-muted); max-width: 60ch; }
  `]
})
export class UploadPageComponent {
  private readonly router = inject(Router);
  private readonly profileApi = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected isProcessing = false;
  protected validationError: string | null = null;
  protected apiError: string | null = null;

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
