import { CommonModule } from '@angular/common';
import { DestroyRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  DraftProfile,
  EducationEntry,
  ExperienceEntry,
  ProfileLink,
  ProjectEntry,
  ProfileSectionVisibility
} from '../../core/models/profile.model';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { CollectionEditorComponent, CollectionEditorField } from '../../shared/components/collection-editor/collection-editor.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';

type DraftEditorForm = FormGroup<{
  fullName: FormControl<string>;
  headline: FormControl<string>;
  summary: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  location: FormControl<string>;
  skills: FormArray<FormControl<string>>;
  links: FormArray<FormGroup<any>>;
  experiences: FormArray<FormGroup<any>>;
  education: FormArray<FormGroup<any>>;
  projects: FormArray<FormGroup<any>>;
  sectionVisibility: FormGroup<{
    links: FormControl<boolean>;
    skills: FormControl<boolean>;
    experiences: FormControl<boolean>;
    education: FormControl<boolean>;
    projects: FormControl<boolean>;
  }>;
}>;

@Component({
  selector: 'r2s-draft-editor-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CollectionEditorComponent,
    ErrorStateComponent,
    LoadingStateComponent
  ],
  template: `
    <section class="container page-grid draft-page">
      <div class="page-header">
        <div>
          <span class="badge">Step 2</span>
          <h1>Edit your profile draft</h1>
          <p>Review the parsed details, fix anything that needs cleanup, and keep moving toward portfolio preview.</p>
        </div>
        <a class="badge" [routerLink]="['/templates', profileId]">Continue to templates</a>
      </div>

      <r2s-loading-state
        *ngIf="isLoading"
        title="Loading your draft profile"
        message="We’re fetching the structured profile tied to this resume parse."
      ></r2s-loading-state>

      <r2s-error-state
        *ngIf="loadError"
        title="We couldn’t load this draft"
        [message]="loadError"
      ></r2s-error-state>

      <form *ngIf="!isLoading && !loadError" class="page-grid" [formGroup]="draftForm" (ngSubmit)="saveDraft()">
        <section class="card section-shell overview-card">
          <div class="overview-copy">
            <span class="badge">Professional profile editor</span>
            <h2>Keep it accurate, simple, and publish-ready.</h2>
            <p>This MVP editor focuses on structured profile data only. Every template will reuse the same saved draft.</p>
          </div>
          <div class="meta-stack">
            <div>
              <span class="meta-label">Profile ID</span>
              <strong>{{ profileId }}</strong>
            </div>
            <div>
              <span class="meta-label">Last saved</span>
              <strong>{{ lastSavedLabel }}</strong>
            </div>
          </div>
        </section>

        <section class="card section-shell">
          <div class="section-heading">
            <div>
              <h2>Core profile</h2>
              <p>These top-level details power the hero section across templates.</p>
            </div>
          </div>

          <p class="helper-copy">Missing sections are okay for this MVP. Save what you have now, then keep filling the draft in over time.</p>

          <div class="field-grid two-column">
            <label class="field">
              <span>Full name</span>
              <input type="text" formControlName="fullName" placeholder="Your full name" />
            </label>
            <label class="field">
              <span>Headline</span>
              <input type="text" formControlName="headline" placeholder="Frontend developer · React · Angular" />
            </label>
            <label class="field field-full">
              <span>Summary</span>
              <textarea formControlName="summary" rows="5" placeholder="Short professional summary"></textarea>
            </label>
            <label class="field">
              <span>Email</span>
              <input type="email" formControlName="email" placeholder="name@example.com" />
              <small class="field-hint" *ngIf="draftForm.controls.email.invalid && draftForm.controls.email.touched">Enter a valid email so the public template can show a working contact point.</small>
            </label>
            <label class="field">
              <span>Phone</span>
              <input type="tel" formControlName="phone" placeholder="+1 555 555 5555" />
            </label>
            <label class="field field-full">
              <span>Location</span>
              <input type="text" formControlName="location" placeholder="City, State" />
            </label>
          </div>
        </section>

        <section class="card section-shell">
          <div class="section-top">
            <div>
              <div class="section-title-row">
                <h2>Skills</h2>
                <span class="badge">{{ skills.length }} skill{{ skills.length === 1 ? '' : 's' }}</span>
              </div>
              <p>Add the key skills you want templates to surface. Keep the list focused for this MVP.</p>
            </div>
            <div class="section-actions">
              <label class="toggle-row">
                <input type="checkbox" [formControl]="sectionVisibility.controls.skills" />
                <span>Show section</span>
              </label>
              <button type="button" class="secondary-button" (click)="addSkill()">Add skill</button>
            </div>
          </div>

          <div class="tag-list" formArrayName="skills" *ngIf="skills.length; else emptySkills">
            <label class="skill-chip" *ngFor="let control of skills.controls; index as index">
              <input [formControl]="control" type="text" placeholder="Skill name" />
              <button type="button" class="text-button danger-text" (click)="removeSkill(index)">Remove</button>
            </label>
          </div>

          <ng-template #emptySkills>
            <div class="empty-state">
              <p>No skills added yet.</p>
              <button type="button" class="secondary-button" (click)="addSkill()">Add skill</button>
            </div>
          </ng-template>
        </section>

        <r2s-collection-editor
          title="Links"
          description="Portfolio, GitHub, LinkedIn, and other professional links are editable here."
          itemLabel="Link"
          addLabel="link"
          [fields]="linkFields"
          [formArray]="links"
          [visible]="sectionVisibility.controls.links.value"
          (add)="addLink()"
          (remove)="removeLink($event)"
          (visibleChange)="sectionVisibility.controls.links.setValue($event)"
        ></r2s-collection-editor>

        <r2s-collection-editor
          title="Experience"
          description="Keep the structure clean so every portfolio template can render work history consistently."
          itemLabel="Experience"
          addLabel="experience"
          [fields]="experienceFields"
          [formArray]="experiences"
          [visible]="sectionVisibility.controls.experiences.value"
          (add)="addExperience()"
          (remove)="removeExperience($event)"
          (visibleChange)="sectionVisibility.controls.experiences.setValue($event)"
        ></r2s-collection-editor>

        <r2s-collection-editor
          title="Education"
          description="Education stays editable after parsing so students and freshers can fine-tune academic details."
          itemLabel="Education"
          addLabel="education entry"
          [fields]="educationFields"
          [formArray]="education"
          [visible]="sectionVisibility.controls.education.value"
          (add)="addEducation()"
          (remove)="removeEducation($event)"
          (visibleChange)="sectionVisibility.controls.education.setValue($event)"
        ></r2s-collection-editor>

        <r2s-collection-editor
          title="Projects"
          description="Projects are especially important for early-career developers, so keep each one concise and practical."
          itemLabel="Project"
          addLabel="project"
          [fields]="projectFields"
          [formArray]="projects"
          [visible]="sectionVisibility.controls.projects.value"
          (add)="addProject()"
          (remove)="removeProject($event)"
          (visibleChange)="sectionVisibility.controls.projects.setValue($event)"
        ></r2s-collection-editor>

        <section class="card section-shell sticky-actions">
          <div>
            <h2>Ready for preview?</h2>
            <p>Save this draft, then move straight into template selection and live preview before login.</p>
            <p class="status-message" *ngIf="saveMessage">{{ saveMessage }}</p>
            <p class="error-message" *ngIf="saveError">{{ saveError }}</p>
            <p class="helper-copy" *ngIf="draftForm.invalid">A few required fields still need attention before the save button is enabled.</p>
          </div>
          <div class="action-row">
            <button type="submit" class="primary-button" [disabled]="isSaving || draftForm.invalid">
              {{ isSaving ? 'Saving…' : 'Save draft' }}
            </button>
            <a class="secondary-button link-button" [routerLink]="['/templates', profileId]">Continue to templates / preview</a>
          </div>
        </section>
      </form>
    </section>
  `,
  styleUrl: './draft-editor-page.component.scss'
})
export class DraftEditorPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly profileApi = inject(ProfileApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected readonly draftForm: DraftEditorForm = this.buildForm();
  protected isLoading = true;
  protected isSaving = false;
  protected loadError: string | null = null;
  protected saveError: string | null = null;
  protected saveMessage: string | null = null;
  protected lastSavedLabel = 'Not saved yet';

  protected readonly linkFields: CollectionEditorField[] = [
    { key: 'label', label: 'Label', placeholder: 'GitHub' },
    { key: 'url', label: 'URL', type: 'url', placeholder: 'https://github.com/username' }
  ];
  protected readonly experienceFields: CollectionEditorField[] = [
    { key: 'company', label: 'Company', placeholder: 'Acme Labs' },
    { key: 'role', label: 'Role', placeholder: 'Frontend Intern' },
    { key: 'location', label: 'Location', placeholder: 'Remote' },
    { key: 'startDate', label: 'Start date', type: 'date' },
    { key: 'endDate', label: 'End date', type: 'date' },
    { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Built reusable UI and shipped product improvements.' }
  ];
  protected readonly educationFields: CollectionEditorField[] = [
    { key: 'institution', label: 'Institution', placeholder: 'State University' },
    { key: 'degree', label: 'Degree', placeholder: 'B.Tech' },
    { key: 'field', label: 'Field', placeholder: 'Computer Science' },
    { key: 'startDate', label: 'Start date', type: 'date' },
    { key: 'endDate', label: 'End date', type: 'date' },
    { key: 'score', label: 'Score / GPA', placeholder: '8.7 CGPA' }
  ];
  protected readonly projectFields: CollectionEditorField[] = [
    { key: 'name', label: 'Project name', placeholder: 'Resume2Site MVP' },
    { key: 'link', label: 'Project link', type: 'url', placeholder: 'https://example.com' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Built a resume-to-portfolio workflow with editable structured drafts.' },
    { key: 'technologiesText', label: 'Technologies', placeholder: 'Angular, TypeScript, Node.js' }
  ];

  constructor() {
    this.loadDraft();
  }

  get skills(): FormArray<FormControl<string>> {
    return this.draftForm.controls.skills;
  }

  get links(): FormArray<FormGroup<any>> {
    return this.draftForm.controls.links;
  }

  get experiences(): FormArray<FormGroup<any>> {
    return this.draftForm.controls.experiences;
  }

  get education(): FormArray<FormGroup<any>> {
    return this.draftForm.controls.education;
  }

  get projects(): FormArray<FormGroup<any>> {
    return this.draftForm.controls.projects;
  }

  get sectionVisibility() {
    return this.draftForm.controls.sectionVisibility;
  }

  protected addSkill(value = ''): void {
    this.skills.push(this.fb.nonNullable.control(value));
  }

  protected removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  protected addLink(value?: Partial<ProfileLink>): void {
    this.links.push(this.createLinkGroup(value));
  }

  protected removeLink(index: number): void {
    this.links.removeAt(index);
  }

  protected addExperience(value?: Partial<ExperienceEntry>): void {
    this.experiences.push(this.createExperienceGroup(value));
  }

  protected removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  protected addEducation(value?: Partial<EducationEntry>): void {
    this.education.push(this.createEducationGroup(value));
  }

  protected removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  protected addProject(value?: Partial<ProjectEntry>): void {
    this.projects.push(this.createProjectGroup(value));
  }

  protected removeProject(index: number): void {
    this.projects.removeAt(index);
  }

  protected saveDraft(): void {
    if (this.draftForm.invalid || this.isSaving) {
      this.draftForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    this.saveMessage = null;

    this.profileApi
      .updateDraft(this.profileId, this.toDraftPayload())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (draft) => {
          this.patchForm(draft);
          this.saveMessage = 'Draft saved. You can continue to templates and preview whenever you’re ready.';
          this.lastSavedLabel = this.formatUpdatedAt(draft.updatedAt);
          this.draftForm.markAsPristine();
        },
        error: () => {
          this.saveError = 'We could not save your changes. Please try again.';
        }
      });
  }

  private loadDraft(): void {
    this.isLoading = true;
    this.loadError = null;

    this.profileApi
      .getDraft(this.profileId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (draft) => {
          this.patchForm(draft);
          this.lastSavedLabel = this.formatUpdatedAt(draft.updatedAt);
        },
        error: () => {
          this.loadError = 'Please refresh and try again. If the draft still fails to load, parse the resume again.';
        }
      });
  }

  private buildForm(): DraftEditorForm {
    return this.fb.nonNullable.group({
      fullName: ['', Validators.required],
      headline: ['', Validators.required],
      summary: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      skills: this.fb.nonNullable.array<FormControl<string>>([]),
      links: this.fb.array<FormGroup<any>>([]),
      experiences: this.fb.array<FormGroup<any>>([]),
      education: this.fb.array<FormGroup<any>>([]),
      projects: this.fb.array<FormGroup<any>>([]),
      sectionVisibility: this.fb.nonNullable.group({
        links: true,
        skills: true,
        experiences: true,
        education: true,
        projects: true
      })
    });
  }

  private patchForm(draft: DraftProfile): void {
    this.draftForm.patchValue({
      fullName: draft.fullName ?? '',
      headline: draft.headline ?? '',
      summary: draft.summary ?? '',
      email: draft.email ?? '',
      phone: draft.phone ?? '',
      location: draft.location ?? '',
      sectionVisibility: this.withDefaultVisibility(draft.sectionVisibility)
    });

    this.setControlArray(this.skills, draft.skills ?? [], (item) => this.fb.nonNullable.control(item));
    this.setControlArray(this.links, this.normalizeLinks(draft), (item) => this.createLinkGroup(item));
    this.setControlArray(this.experiences, draft.experiences ?? [], (item) => this.createExperienceGroup(item));
    this.setControlArray(this.education, draft.education ?? [], (item) => this.createEducationGroup(item));
    this.setControlArray(this.projects, draft.projects ?? [], (item) => this.createProjectGroup(item));
  }

  private toDraftPayload(): Partial<DraftProfile> {
    const raw = this.draftForm.getRawValue();

    return {
      fullName: raw.fullName,
      headline: raw.headline,
      summary: raw.summary,
      email: raw.email,
      phone: raw.phone,
      location: raw.location,
      links: raw.links.map((link) => ({
        id: link['id'] || this.createId('link'),
        label: link['label'] || '',
        url: link['url'] || ''
      })),
      skills: raw.skills.filter((skill) => skill.trim().length > 0),
      experiences: raw.experiences.map((experience) => ({
        id: experience['id'] || this.createId('exp'),
        company: experience['company'] || '',
        role: experience['role'] || '',
        location: experience['location'] || '',
        startDate: experience['startDate'] || '',
        endDate: experience['endDate'] || '',
        summary: experience['summary'] || '',
        highlights: []
      })),
      education: raw.education.map((entry) => ({
        id: entry['id'] || this.createId('edu'),
        institution: entry['institution'] || '',
        degree: entry['degree'] || '',
        field: entry['field'] || '',
        startDate: entry['startDate'] || '',
        endDate: entry['endDate'] || '',
        score: entry['score'] || ''
      })),
      projects: raw.projects.map((project) => ({
        id: project['id'] || this.createId('project'),
        name: project['name'] || '',
        description: project['description'] || '',
        technologies: this.parseTechnologies(project['technologiesText'] || ''),
        link: project['link'] || ''
      })),
      sectionVisibility: raw.sectionVisibility
    };
  }

  private createLinkGroup(value?: Partial<ProfileLink>): FormGroup<any> {
    return this.fb.nonNullable.group({
      id: value?.id ?? this.createId('link'),
      label: value?.label ?? '',
      url: value?.url ?? ''
    });
  }

  private createExperienceGroup(value?: Partial<ExperienceEntry>): FormGroup<any> {
    return this.fb.nonNullable.group({
      id: value?.id ?? this.createId('exp'),
      company: value?.company ?? '',
      role: value?.role ?? '',
      location: value?.location ?? '',
      startDate: value?.startDate ?? '',
      endDate: value?.endDate ?? '',
      summary: value?.summary ?? ''
    });
  }

  private createEducationGroup(value?: Partial<EducationEntry>): FormGroup<any> {
    return this.fb.nonNullable.group({
      id: value?.id ?? this.createId('edu'),
      institution: value?.institution ?? '',
      degree: value?.degree ?? '',
      field: value?.field ?? '',
      startDate: value?.startDate ?? '',
      endDate: value?.endDate ?? '',
      score: value?.score ?? ''
    });
  }

  private createProjectGroup(value?: Partial<ProjectEntry>): FormGroup<any> {
    return this.fb.nonNullable.group({
      id: value?.id ?? this.createId('project'),
      name: value?.name ?? '',
      description: value?.description ?? '',
      link: value?.link ?? '',
      technologiesText: (value?.technologies ?? []).join(', ')
    });
  }

  private normalizeLinks(draft: DraftProfile): ProfileLink[] {
    if (draft.links?.length) {
      return draft.links;
    }

    return draft.socialLinks ?? [];
  }

  private withDefaultVisibility(visibility?: Partial<ProfileSectionVisibility>): ProfileSectionVisibility {
    return {
      links: visibility?.links ?? true,
      skills: visibility?.skills ?? true,
      experiences: visibility?.experiences ?? true,
      education: visibility?.education ?? true,
      projects: visibility?.projects ?? true
    };
  }

  private setControlArray<TControl extends AbstractControl>(formArray: FormArray<TControl>, items: unknown[], factory: (item: any) => TControl): void {
    while (formArray.length) {
      formArray.removeAt(0);
    }

    items.forEach((item) => {
      formArray.push(factory(item));
    });
  }

  private parseTechnologies(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private createId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private formatUpdatedAt(updatedAt?: string): string {
    return updatedAt ? new Date(updatedAt).toLocaleString() : 'Not saved yet';
  }
}
