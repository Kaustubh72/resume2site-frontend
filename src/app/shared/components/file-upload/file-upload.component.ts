import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAX_RESUME_FILE_SIZE_MB } from '../../../core/constants/app.constants';
import { validateResumeFile } from '../../../core/utils/file.util';

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
          <span class="upload__hint">No login required. PDF and DOCX only, up to {{ maxResumeFileSizeMb }} MB.</span>
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
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  protected readonly maxResumeFileSizeMb = MAX_RESUME_FILE_SIZE_MB;
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

    const validationMessage = validateResumeFile(file);
    if (validationMessage) {
      this.selectedFileName = null;
      input.value = '';
      this.validationError.emit(validationMessage);
      return;
    }

    this.selectedFileName = file.name;
    this.fileSelected.emit(file);
  }

}
