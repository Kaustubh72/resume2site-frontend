import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'r2s-template-preview-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Preview before signup</span>
          <h1>{{ templateId | titlecase }} template preview shell</h1>
          <p>This placeholder route proves the preview flow exists before auth is introduced.</p>
        </div>
        <a class="badge" [routerLink]="['/publish', draftId]">Publish this template</a>
      </div>

      <article class="card section-shell preview-shell">
        <h2>Live preview area</h2>
        <p>Next steps will bind this view to draft data and a real template renderer.</p>
      </article>
    </section>
  `,
  styles: [`.preview-shell { min-height: 380px; } h2, p { margin: 0; } p { color: var(--text-muted); margin-top: 0.5rem; }`]
})
export class TemplatePreviewPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly draftId = this.route.snapshot.paramMap.get('draftId') ?? 'draft';
  protected readonly templateId = this.route.snapshot.paramMap.get('templateId') ?? 'classic';
}
