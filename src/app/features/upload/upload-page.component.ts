import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'r2s-upload-page',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, LoadingStateComponent],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Step 1</span>
          <h1>Upload flow foundation</h1>
          <p>Anonymous resume upload is the first value point in the MVP.</p>
        </div>
      </div>

      <r2s-file-upload (fileSelected)="handleFile($event)" />
      <r2s-loading-state *ngIf="isUploading" title="Upload placeholder" message="The backend integration will begin in the next implementation step." />
    </section>
  `
})
export class UploadPageComponent {
  isUploading = false;

  constructor(private readonly router: Router) {}

  handleFile(): void {
    this.isUploading = true;
    void this.router.navigate(['/draft', 'demo-draft']);
  }
}
