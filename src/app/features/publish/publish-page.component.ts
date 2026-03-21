import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SlugInputComponent } from '../../shared/components/slug-input/slug-input.component';

@Component({
  selector: 'r2s-publish-page',
  standalone: true,
  imports: [ReactiveFormsModule, SlugInputComponent],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Step 4</span>
          <h1>Publish flow shell</h1>
          <p>Draft {{ draftId }} is ready for slug selection after authentication.</p>
        </div>
      </div>

      <article class="card section-shell publish-shell">
        <h2>Choose public URL</h2>
        <p>Slug checks will call the backend without changing this component API.</p>
        <r2s-slug-input [control]="slugControl" [feedback]="feedback" [available]="true"></r2s-slug-input>
      </article>
    </section>
  `,
  styles: [`.publish-shell { display: grid; gap: 1rem; } h2, p { margin: 0; } p { color: var(--text-muted); }`]
})
export class PublishPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly draftId = this.route.snapshot.paramMap.get('draftId') ?? 'draft';
  protected readonly slugControl = new FormControl('your-name');
  protected readonly feedback = 'Looks good. This slug is available in the mock foundation.';
}
