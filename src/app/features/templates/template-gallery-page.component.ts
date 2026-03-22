import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { DraftProfile, PortfolioTemplateId, TemplateDefinition } from '../../core/models/profile.model';
import { DEFAULT_TEMPLATE_ID, STORAGE_KEYS } from '../../core/constants/app.constants';
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
  styleUrl: './template-gallery-page.component.scss'
})
export class TemplateGalleryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileApi = inject(ProfileApiService);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected templates: TemplateDefinition[] = [];
  protected profile: DraftProfile | null = null;
  protected selectedTemplateId: PortfolioTemplateId = DEFAULT_TEMPLATE_ID;
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
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.selectedTemplateId = updatedProfile.selectedTemplate;
      },
      error: () => {
        this.loadError = 'We couldn’t save that template selection. Please try again.';
      }
    });
  }


  private loadData(): void {
    forkJoin({
      templates: this.profileApi.getTemplates(),
      profile: this.profileApi.getDraft(this.profileId)
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
    return availableIds.has(profile.selectedTemplate) ? profile.selectedTemplate : DEFAULT_TEMPLATE_ID;
  }

  private storageKey(): string {
    return `${STORAGE_KEYS.selectedTemplatePrefix}${this.profileId}`;
  }
}
