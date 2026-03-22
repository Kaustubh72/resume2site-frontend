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
  styleUrl: './template-preview-page.component.scss'
})
export class TemplatePreviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profileApi = inject(ProfileApiService);

  protected readonly profileId = this.route.snapshot.paramMap.get('profileId') ?? 'draft';
  protected templates: TemplateDefinition[] = [];
  protected profile: DraftProfile | null = null;
  protected selectedTemplateId = (this.route.snapshot.paramMap.get('templateId') ?? DEFAULT_TEMPLATE_ID) as PortfolioTemplateId;
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
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
      },
      error: () => {
        this.loadError = 'We couldn’t save that template selection. Please try again.';
      }
    });
  }

  private loadPreview(): void {
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
    return `${STORAGE_KEYS.selectedTemplatePrefix}${this.profileId}`;
  }
}
