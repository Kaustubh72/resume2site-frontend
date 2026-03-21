import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'r2s-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="upload card" [class.upload--disabled]="disabled">
      <div class="upload__content">
        <span class="badge">PDF / DOCX only</span>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>

        <div class="upload__actions">
          <label class="upload__button" for="resume-upload">
            {{ ctaLabel }}
          </label>
          <span class="upload__hint">No login required. PDF and DOCX only.</span>
        </div>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          [disabled]="disabled"
          (change)="onFileSelected($event)"
        >

        <p *ngIf="selectedFileName" class="upload__selected">Selected: {{ selectedFileName }}</p>
        <p *ngIf="errorMessage" class="upload__error">{{ errorMessage }}</p>
      </div>
    </section>
  `,
  styles: [`
    .upload { padding: 2rem; border-style: dashed; }
    .upload--disabled { opacity: 0.8; pointer-events: none; }
    .upload__content { display: grid; gap: 0.85rem; }
    .upload h3 { margin: 0; font-size: 1.5rem; }
    .upload p { margin: 0; color: var(--text-muted); }
    .upload__actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem; }
    .upload__button {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 48px; padding: 0 1rem; border-radius: 14px; cursor: pointer;
      background: var(--primary); color: white; font-weight: 700;
    }
    .upload__hint { font-size: 0.95rem; }
    .upload__selected { color: var(--text); font-weight: 600; }
    .upload__error { color: var(--danger); font-weight: 600; }
    input { display: none; }
  `]
})
export class FileUploadComponent {
  @Input() title = 'Upload your resume';
  @Input() description = 'Generate an editable draft profile and preview your portfolio before sign up.';
  @Input() ctaLabel = 'Upload Resume';
  @Input() errorMessage: string | null = null;
  @Input() disabled = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() validationError = new EventEmitter<string>();

  selectedFileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const validationMessage = this.validateFile(file);
    if (validationMessage) {
      this.selectedFileName = null;
      input.value = '';
      this.validationError.emit(validationMessage);
      return;
    }

    this.selectedFileName = file.name;
    this.fileSelected.emit(file);
  }

  private validateFile(file: File): string | null {
    const fileName = file.name.toLowerCase();
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isPdf = fileName.endsWith('.pdf');
    const isDocx = fileName.endsWith('.docx');
    const hasValidExtension = isPdf || isDocx;
    const hasValidMimeType = !file.type || allowedMimeTypes.includes(file.type);

    if (!hasValidExtension || !hasValidMimeType) {
      return 'Please upload a PDF or DOCX resume only.';
    }

    return null;
  }
}
