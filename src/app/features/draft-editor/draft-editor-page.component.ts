import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SectionEditorComponent } from '../../shared/components/section-editor/section-editor.component';

@Component({
  selector: 'r2s-draft-editor-page',
  standalone: true,
  imports: [SectionEditorComponent, RouterLink],
  template: `
    <section class="container page-grid">
      <div class="page-header">
        <div>
          <span class="badge">Step 2</span>
          <h1>Draft editor shell</h1>
          <p>Draft ID: {{ draftId }}. Structured sections are shared across templates and fully editable.</p>
        </div>
        <a class="badge" [routerLink]="['/templates', draftId]">Continue to templates</a>
      </div>

      <r2s-section-editor title="Experience" description="Resume experience entries parsed into structured items." [items]="sample.experiences" itemLabelKey="company"></r2s-section-editor>
      <r2s-section-editor title="Projects" description="Projects will feed every portfolio template from the same schema." [items]="sample.projects" itemLabelKey="name"></r2s-section-editor>
      <r2s-section-editor title="Education" description="Education data remains editable after parsing." [items]="sample.education" itemLabelKey="institution"></r2s-section-editor>
    </section>
  `
})
export class DraftEditorPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly draftId = this.route.snapshot.paramMap.get('draftId') ?? 'draft';
  protected readonly sample = {
    experiences: [{ company: 'Acme Labs', role: 'Frontend Intern', summary: 'Built Angular components.' }],
    projects: [{ name: 'Portfolio Generator', description: 'Generated portfolio drafts from resume data.' }],
    education: [{ institution: 'State University', degree: 'B.Tech', field: 'Computer Science' }]
  };
}
