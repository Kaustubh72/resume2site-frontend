import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'r2s-file-upload',
  standalone: true,
  template: `
    <label class="upload card" for="resume-upload">
      <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)">
      <span class="badge">PDF / DOCX</span>
      <h3>Upload your resume</h3>
      <p>Drop a resume to generate an editable draft profile and preview before sign up.</p>
    </label>
  `,
  styles: [`
    .upload { display: grid; gap: 0.75rem; padding: 2rem; border-style: dashed; text-align: left; cursor: pointer; }
    .upload input { display: none; }
    .upload h3 { margin: 0; }
    .upload p { margin: 0; color: var(--text-muted); }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
