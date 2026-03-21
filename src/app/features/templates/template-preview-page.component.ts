import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DraftProfile, PortfolioTemplateId, TemplateDefinition } from '../../core/models/profile.model';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { TemplateRendererComponent } from '../../shared/components/template-renderer/template-renderer.component';

@Component({
  selector: 'r2s-template-preview-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TemplateRendererComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="container page-grid preview-page">
      <div class="page-header">
        <div>
          <span class="badge">Preview before signup</span>
          <h1>Live portfolio preview</h1>
          <p>Review your current draft profile in the selected template, switch layouts instantly, then publish when ready.</p>
        </div>
        <div class="header-actions">
          <a class="secondary-button link-button" [routerLink]="['/templates', profileId]">Back to gallery</a>
          <a class="primary-button" [routerLink]="['/publish', profileId]">Publish portfolio</a>
        </div>
      </div>

      <r2s-loading-state *ngIf="isLoading" title="Preparing preview" message="We’re loading your draft profile and available templates." />
      <r2s-error-state *ngIf="loadError" title="We couldn’t load the preview" [message]="loadError" />

      <ng-container *ngIf="!isLoading && !loadError && profile">
        <section class="card section-shell controls-panel">
          <div>
            <span class="badge">Template switcher</span>
            <h2>{{ selectedTemplateDefinition?.name }}</h2>
            <p>{{ selectedTemplateDefinition?.description }}</p>
          </div>

          <div class="toggle-group template-toggle-group">
            <button
              *ngFor="let template of templates"
              type="button"
              class="toggle-pill"
              [class.active]="template.id === selectedTemplateId"
              (click)="selectTemplate(template.id)"
            >
              {{ template.name }}
            </button>
          </div>

          <div class="toggle-group">
            <button type="button" class="toggle-pill" [class.active]="device === 'desktop'" (click)="device = 'desktop'">Desktop</button>
            <button type="button" class="toggle-pill" [class.active]="device === 'mobile'" (click)="device = 'mobile'">Mobile</button>
          </div>
        </section>

        <r2s-template-renderer [profile]="profile" [templateId]="selectedTemplateId" [device]="device" />

        <section class="card section-shell preview-cta">
          <div>
            <h2>Happy with this preview?</h2>
            <p>You can keep editing the same structured draft later and republish without rebuilding the page.</p>
          </div>
          <div class="header-actions">
            <a class="secondary-button link-button" [routerLink]="['/draft', profileId]">Edit draft data</a>
            <a class="primary-button" [routerLink]="['/publish', profileId]">Publish this portfolio</a>
          </div>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .preview-page { padding: 1rem 0 3rem; }
    h1, h2, p { margin: 0; }
    .page-header p, .controls-panel p, .preview-cta p { color: var(--text-muted); }
    .header-actions, .toggle-group { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .controls-panel, .preview-cta { display: grid; gap: 1rem; }
    .template-toggle-group { justify-content: flex-start; }
    .toggle-pill { border: 1px solid var(--border); background: white; color: var(--text); padding: 0.8rem 1rem; border-radius: 999px; font-weight: 700; }
    .toggle-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
  `]
})
export class TemplatePreviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileApi = inject(ProfileApiService);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected templates: TemplateDefinition[] = [];
  protected profile: DraftProfile | null = null;
  protected selectedTemplateId = (this.route.snapshot.paramMap.get('templateId') ?? 'classic') as PortfolioTemplateId;
  protected device: 'desktop' | 'mobile' = 'desktop';
  protected isLoading = true;
  protected loadError: string | null = null;

  constructor() {
    this.loadPreview();
  }

  protected get selectedTemplateDefinition(): TemplateDefinition | undefined {
    return this.templates.find((template) => template.id === this.selectedTemplateId);
  }

  protected selectTemplate(templateId: PortfolioTemplateId): void {
    this.selectedTemplateId = templateId;
    if (this.profile) {
      this.profile = { ...this.profile, selectedTemplate: templateId };
    }
    localStorage.setItem(this.storageKey(), templateId);
    this.profileApi.updateDraft(this.profileId, { selectedTemplate: templateId }).pipe(
      catchError(() => of(null)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((updatedProfile) => {
      if (updatedProfile) {
        this.profile = updatedProfile;
      }
    });
  }

  private loadPreview(): void {
    forkJoin({
      templates: this.profileApi.getTemplates(),
      profile: this.profileApi.getDraft(this.profileId).pipe(catchError(() => of(this.buildFallbackProfile())))
    }).pipe(
      finalize(() => this.isLoading = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ templates, profile }) => {
        this.templates = templates;
        this.profile = profile;
        const templateIds = new Set(templates.map((template) => template.id));
        const stored = localStorage.getItem(this.storageKey()) as PortfolioTemplateId | null;
        if (stored && templateIds.has(stored)) {
          this.selectedTemplateId = stored;
        } else if (!templateIds.has(this.selectedTemplateId)) {
          this.selectedTemplateId = profile.selectedTemplate;
        }
      },
      error: () => {
        this.loadError = 'Make sure the draft profile exists before opening the live preview.';
      }
    });
  }

  private storageKey(): string {
    return `r2s:selected-template:${this.profileId}`;
  }

  private buildFallbackProfile(): DraftProfile {
    return {
      id: this.profileId,
      fullName: 'Avery Johnson',
      headline: 'Frontend developer building polished product experiences',
      summary: 'Early-career engineer with internship and project experience across Angular, React, and TypeScript. Focused on converting structured content into production-ready UI.',
      email: 'avery@example.com',
      phone: '+1 555 010 1010',
      location: 'Austin, TX',
      website: 'resume2site.dev/avery',
      links: [
        { id: 'github', label: 'GitHub', url: 'https://github.com/avery' },
        { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/avery' }
      ],
      socialLinks: [],
      skills: ['Angular', 'TypeScript', 'Node.js', 'Design systems', 'REST APIs'],
      experiences: [
        {
          id: 'exp-1', company: 'LaunchPad Labs', role: 'Frontend Intern', location: 'Remote', startDate: '2025-01-01', endDate: '2025-05-01',
          summary: 'Built reusable UI flows for onboarding and profile editing in a student-focused product.', highlights: ['Reduced UI duplication across core screens', 'Improved first-time-user flow for profile setup']
        }
      ],
      education: [
        { id: 'edu-1', institution: 'State University', degree: 'B.S.', field: 'Computer Science', startDate: '2022-08-01', endDate: '2026-05-01', score: '3.8 GPA' }
      ],
      projects: [
        { id: 'proj-1', name: 'Resume2Site MVP', description: 'Turned resume uploads into editable portfolio drafts with template-based previews.', technologies: ['Angular', 'TypeScript', 'Node'], link: 'https://example.com' },
        { id: 'proj-2', name: 'Campus Events App', description: 'Created a mobile-first event discovery app for students.', technologies: ['Firebase', 'React Native'] }
      ],
      sectionVisibility: { links: true, skills: true, experiences: true, education: true, projects: true },
      selectedTemplate: 'classic',
      status: 'draft'
    };
  }
}
