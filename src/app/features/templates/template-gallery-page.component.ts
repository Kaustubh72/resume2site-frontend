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
import { TemplateCardComponent } from '../../shared/components/template-card/template-card.component';
import { TemplateRendererComponent } from '../../shared/components/template-renderer/template-renderer.component';

@Component({
  selector: 'r2s-template-gallery-page',
  standalone: true,
  imports: [CommonModule, TemplateCardComponent, TemplateRendererComponent, RouterLink, LoadingStateComponent, ErrorStateComponent],
  template: `
    <section class="container page-grid templates-page">
      <div class="page-header">
        <div>
          <span class="badge">Step 3</span>
          <h1>Choose a portfolio template</h1>
          <p>Switch between polished MVP layouts without losing any structured profile data from your draft.</p>
        </div>
        <a class="badge" [routerLink]="['/draft', profileId]">Back to draft editor</a>
      </div>

      <r2s-loading-state *ngIf="isLoading" title="Loading templates" message="We’re fetching template options and your draft profile." />
      <r2s-error-state *ngIf="loadError" title="We couldn’t load the gallery" [message]="loadError" />

      <ng-container *ngIf="!isLoading && !loadError && profile">
        <section class="card section-shell selected-summary">
          <div>
            <span class="badge">Current selection</span>
            <h2>{{ selectedTemplateDefinition?.name }} template</h2>
            <p>{{ selectedTemplateDefinition?.description }}</p>
          </div>
          <div class="summary-actions">
            <a class="secondary-button link-button" [routerLink]="['/templates', profileId, 'preview', selectedTemplateId]">Open live preview</a>
            <a class="primary-button" [routerLink]="['/publish', profileId]">Publish this portfolio</a>
          </div>
        </section>

        <section class="template-grid">
          <r2s-template-card
            *ngFor="let template of templates"
            [template]="template"
            [selected]="template.id === selectedTemplateId"
            [previewLink]="['/templates', profileId, 'preview', template.id]"
            (select)="selectTemplate($event)"
          />
        </section>

        <section class="card section-shell gallery-preview">
          <div class="preview-header-row">
            <div>
              <span class="badge">Instant preview</span>
              <h2>{{ selectedTemplateDefinition?.name }} in context</h2>
            </div>
            <a class="text-link" [routerLink]="['/templates', profileId, 'preview', selectedTemplateId]">Expand to full preview</a>
          </div>
          <r2s-template-renderer [profile]="profile" [templateId]="selectedTemplateId" device="desktop" />
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .templates-page { padding: 1rem 0 3rem; }
    h1, h2, p { margin: 0; }
    .page-header p, .selected-summary p { color: var(--text-muted); }
    .template-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .selected-summary, .summary-actions, .preview-header-row { display: flex; gap: 1rem; justify-content: space-between; align-items: center; flex-wrap: wrap; }
    .gallery-preview { display: grid; gap: 1.25rem; overflow: hidden; }
    .text-link { color: var(--primary); font-weight: 700; }
    @media (max-width: 768px) {
      .selected-summary, .summary-actions, .preview-header-row { align-items: flex-start; }
    }
  `]
})
export class TemplateGalleryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileApi = inject(ProfileApiService);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected templates: TemplateDefinition[] = [];
  protected profile: DraftProfile | null = null;
  protected selectedTemplateId: PortfolioTemplateId = 'classic';
  protected isLoading = true;
  protected loadError: string | null = null;

  constructor() {
    this.loadData();
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
        this.selectedTemplateId = updatedProfile.selectedTemplate;
      }
    });
  }


  private loadData(): void {
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
        this.selectedTemplateId = this.resolveSelectedTemplate(profile, templates);
      },
      error: () => {
        this.loadError = 'Try reloading the page after your draft profile is available.';
      }
    });
  }

  private resolveSelectedTemplate(profile: DraftProfile, templates: TemplateDefinition[]): PortfolioTemplateId {
    const stored = localStorage.getItem(this.storageKey()) as PortfolioTemplateId | null;
    const availableIds = new Set(templates.map((template) => template.id));
    if (stored && availableIds.has(stored)) {
      return stored;
    }
    return availableIds.has(profile.selectedTemplate) ? profile.selectedTemplate : 'classic';
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
