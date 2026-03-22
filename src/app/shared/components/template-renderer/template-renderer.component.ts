import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DraftProfile, PortfolioTemplateId, ProfileLink } from '../../../core/models/profile.model';
import { PublicProfileSectionComponent } from '../public-profile-section/public-profile-section.component';

@Component({
  selector: 'r2s-template-renderer',
  standalone: true,
  imports: [CommonModule, PublicProfileSectionComponent],
  template: `
    <ng-container *ngIf="profile as currentProfile">
      <article class="preview-canvas" [ngClass]="[templateId, device]">
        <ng-container [ngSwitch]="templateId">
          <ng-container *ngSwitchCase="'minimal'">
            <section class="template-shell minimal-shell">
              <header class="hero minimal-hero">
                <div>
                  <p class="eyebrow">{{ displayHeadline(currentProfile) }}</p>
                  <h1>{{ displayName(currentProfile) }}</h1>
                  <p class="lead">{{ displaySummary(currentProfile) }}</p>
                </div>
                <div class="hero-aside compact-card" *ngIf="showContactCard(currentProfile)">
                  <div *ngIf="currentProfile.email"><strong>Email</strong><span>{{ currentProfile.email }}</span></div>
                  <div *ngIf="currentProfile.location"><strong>Location</strong><span>{{ currentProfile.location }}</span></div>
                  <div *ngIf="currentProfile.website"><strong>Website</strong><span>{{ currentProfile.website }}</span></div>
                </div>
              </header>

              <section class="chip-row" *ngIf="currentProfile.sectionVisibility.skills && currentProfile.skills.length">
                <span *ngFor="let skill of currentProfile.skills">{{ skill }}</span>
              </section>

              <div class="content-grid single-column">
                <r2s-public-profile-section title="Experience" *ngIf="currentProfile.sectionVisibility.experiences && currentProfile.experiences.length">
                  <div class="timeline-list">
                    <article class="timeline-item" *ngFor="let experience of currentProfile.experiences">
                      <div class="timeline-head">
                        <div>
                          <h3>{{ experience.role }}</h3>
                          <p>{{ experience.company }}<span *ngIf="experience.location"> · {{ experience.location }}</span></p>
                        </div>
                        <span>{{ formatDateRange(experience.startDate, experience.endDate) }}</span>
                      </div>
                      <p>{{ experience.summary }}</p>
                      <ul *ngIf="experience.highlights.length">
                        <li *ngFor="let highlight of experience.highlights">{{ highlight }}</li>
                      </ul>
                    </article>
                  </div>
                </r2s-public-profile-section>

                <r2s-public-profile-section title="Projects" *ngIf="currentProfile.sectionVisibility.projects && currentProfile.projects.length">
                  <div class="project-grid minimal-projects">
                    <article class="project-card compact-card" *ngFor="let project of currentProfile.projects">
                      <div class="project-topline">
                        <h3>{{ project.name }}</h3>
                        <a *ngIf="project.link" [href]="project.link" target="_blank" rel="noreferrer">View</a>
                      </div>
                      <p>{{ project.description }}</p>
                      <div class="tag-row">
                        <span *ngFor="let technology of project.technologies">{{ technology }}</span>
                      </div>
                    </article>
                  </div>
                </r2s-public-profile-section>

                <r2s-public-profile-section title="Education" *ngIf="currentProfile.sectionVisibility.education && currentProfile.education.length">
                  <div class="stack-list">
                    <article class="compact-card" *ngFor="let item of currentProfile.education">
                      <h3>{{ item.degree }}</h3>
                      <p>{{ item.institution }}<span *ngIf="item.field"> · {{ item.field }}</span></p>
                      <small>{{ formatDateRange(item.startDate, item.endDate) }}<span *ngIf="item.score"> · {{ item.score }}</span></small>
                    </article>
                  </div>
                </r2s-public-profile-section>
              </div>
            </section>
          </ng-container>

          <ng-container *ngSwitchCase="'spotlight'">
            <section class="template-shell spotlight-shell">
              <header class="hero spotlight-hero">
                <div class="hero-panel accent-panel">
                  <span class="template-kicker">Selected template</span>
                  <h1>{{ displayName(currentProfile) }}</h1>
                  <p class="lead">{{ displayHeadline(currentProfile) }}</p>
                  <p>{{ displaySummary(currentProfile) }}</p>
                  <div class="hero-links" *ngIf="primaryLinks(currentProfile).length">
                    <a *ngFor="let link of primaryLinks(currentProfile)" [href]="link.url" target="_blank" rel="noreferrer">{{ link.label }}</a>
                  </div>
                </div>
                <div class="hero-panel metrics-panel">
                  <div>
                    <strong>{{ currentProfile.projects.length }}</strong>
                    <span>Projects</span>
                  </div>
                  <div>
                    <strong>{{ currentProfile.experiences.length }}</strong>
                    <span>Experience entries</span>
                  </div>
                  <div>
                    <strong>{{ currentProfile.skills.length }}</strong>
                    <span>Skills</span>
                  </div>
                </div>
              </header>

              <div class="content-grid spotlight-grid">
                <r2s-public-profile-section title="Featured projects" description="Project-forward layout for early-career developers." *ngIf="currentProfile.sectionVisibility.projects && currentProfile.projects.length">
                  <div class="project-grid spotlight-projects">
                    <article class="project-card accent-card" *ngFor="let project of currentProfile.projects">
                      <div class="project-topline">
                        <h3>{{ project.name }}</h3>
                        <a *ngIf="project.link" [href]="project.link" target="_blank" rel="noreferrer">Open</a>
                      </div>
                      <p>{{ project.description }}</p>
                      <div class="tag-row">
                        <span *ngFor="let technology of project.technologies">{{ technology }}</span>
                      </div>
                    </article>
                  </div>
                </r2s-public-profile-section>

                <div class="sidebar-stack">
                  <r2s-public-profile-section title="Skills" *ngIf="currentProfile.sectionVisibility.skills && currentProfile.skills.length">
                    <div class="tag-row tall-tags">
                      <span *ngFor="let skill of currentProfile.skills">{{ skill }}</span>
                    </div>
                  </r2s-public-profile-section>

                  <r2s-public-profile-section title="Experience" *ngIf="currentProfile.sectionVisibility.experiences && currentProfile.experiences.length">
                    <div class="stack-list">
                      <article class="compact-card" *ngFor="let experience of currentProfile.experiences">
                        <h3>{{ experience.role }}</h3>
                        <p>{{ experience.company }}</p>
                        <small>{{ formatDateRange(experience.startDate, experience.endDate) }}</small>
                      </article>
                    </div>
                  </r2s-public-profile-section>

                  <r2s-public-profile-section title="Education" *ngIf="currentProfile.sectionVisibility.education && currentProfile.education.length">
                    <div class="stack-list">
                      <article class="compact-card" *ngFor="let item of currentProfile.education">
                        <h3>{{ item.degree }}</h3>
                        <p>{{ item.institution }}</p>
                        <small>{{ item.score || formatDateRange(item.startDate, item.endDate) }}</small>
                      </article>
                    </div>
                  </r2s-public-profile-section>
                </div>
              </div>
            </section>
          </ng-container>

          <ng-container *ngSwitchDefault>
            <section class="template-shell classic-shell">
              <header class="hero classic-hero">
                <div>
                  <span class="template-kicker">Portfolio preview</span>
                  <h1>{{ displayName(currentProfile) }}</h1>
                  <p class="lead">{{ displayHeadline(currentProfile) }}</p>
                </div>
                <div class="hero-contact" *ngIf="showContactCard(currentProfile)">
                  <span>{{ currentProfile.email }}</span>
                  <span *ngIf="currentProfile.phone">{{ currentProfile.phone }}</span>
                  <span *ngIf="currentProfile.location">{{ currentProfile.location }}</span>
                </div>
              </header>

              <div class="intro-card compact-card">
                <p>{{ displaySummary(currentProfile) }}</p>
                <div class="link-row" *ngIf="currentProfile.sectionVisibility.links && primaryLinks(currentProfile).length">
                  <a *ngFor="let link of primaryLinks(currentProfile)" [href]="link.url" target="_blank" rel="noreferrer">{{ link.label }}</a>
                </div>
              </div>

              <div class="content-grid classic-grid">
                <div class="main-stack">
                  <r2s-public-profile-section title="Experience" *ngIf="currentProfile.sectionVisibility.experiences && currentProfile.experiences.length">
                    <div class="timeline-list">
                      <article class="timeline-item" *ngFor="let experience of currentProfile.experiences">
                        <div class="timeline-head">
                          <div>
                            <h3>{{ experience.role }}</h3>
                            <p>{{ experience.company }}</p>
                          </div>
                          <span>{{ formatDateRange(experience.startDate, experience.endDate) }}</span>
                        </div>
                        <p>{{ experience.summary }}</p>
                      </article>
                    </div>
                  </r2s-public-profile-section>

                  <r2s-public-profile-section title="Projects" *ngIf="currentProfile.sectionVisibility.projects && currentProfile.projects.length">
                    <div class="project-grid">
                      <article class="project-card compact-card" *ngFor="let project of currentProfile.projects">
                        <div class="project-topline">
                          <h3>{{ project.name }}</h3>
                          <a *ngIf="project.link" [href]="project.link" target="_blank" rel="noreferrer">Visit</a>
                        </div>
                        <p>{{ project.description }}</p>
                      </article>
                    </div>
                  </r2s-public-profile-section>
                </div>

                <aside class="sidebar-stack">
                  <r2s-public-profile-section title="Skills" *ngIf="currentProfile.sectionVisibility.skills && currentProfile.skills.length">
                    <div class="tag-row">
                      <span *ngFor="let skill of currentProfile.skills">{{ skill }}</span>
                    </div>
                  </r2s-public-profile-section>

                  <r2s-public-profile-section title="Education" *ngIf="currentProfile.sectionVisibility.education && currentProfile.education.length">
                    <div class="stack-list">
                      <article class="compact-card" *ngFor="let item of currentProfile.education">
                        <h3>{{ item.degree }}</h3>
                        <p>{{ item.institution }}</p>
                        <small>{{ formatDateRange(item.startDate, item.endDate) }}</small>
                      </article>
                    </div>
                  </r2s-public-profile-section>
                </aside>
              </div>

              <section class="compact-card empty-portfolio" *ngIf="!hasVisibleContent(currentProfile)">
                <h3>Your content will appear here</h3>
                <p>Add experience, projects, education, skills, or links in the draft editor to make this portfolio more complete.</p>
              </section>
            </section>
          </ng-container>
        </ng-container>
      </article>
    </ng-container>
  `,
  styleUrl: './template-renderer.component.scss'
})
export class TemplateRendererComponent {
  @Input({ required: true }) profile!: DraftProfile;
  @Input() templateId: PortfolioTemplateId = 'classic';
  @Input() device: 'desktop' | 'mobile' = 'desktop';

  protected primaryLinks(profile: DraftProfile): ProfileLink[] {
    return [...(profile.links ?? []), ...(profile.socialLinks ?? [])]
      .filter((link) => link.label && link.url)
      .slice(0, 4);
  }

  protected displayName(profile: DraftProfile): string {
    return profile.fullName?.trim() || 'Your portfolio';
  }

  protected displayHeadline(profile: DraftProfile): string {
    return profile.headline?.trim() || 'Professional profile';
  }

  protected displaySummary(profile: DraftProfile): string {
    return profile.summary?.trim() || 'This portfolio is ready for your summary, projects, and experience highlights.';
  }

  protected showContactCard(profile: DraftProfile): boolean {
    return Boolean(profile.email || profile.phone || profile.location || profile.website);
  }

  protected hasVisibleContent(profile: DraftProfile): boolean {
    return Boolean(
      (profile.sectionVisibility.skills && profile.skills?.length) ||
      (profile.sectionVisibility.links && this.primaryLinks(profile).length) ||
      (profile.sectionVisibility.experiences && profile.experiences?.length) ||
      (profile.sectionVisibility.education && profile.education?.length) ||
      (profile.sectionVisibility.projects && profile.projects?.length)
    );
  }

  protected formatDateRange(startDate?: string, endDate?: string): string {
    const start = startDate ? this.formatDate(startDate) : 'Start';
    const end = endDate ? this.formatDate(endDate) : 'Present';
    return `${start} – ${end}`;
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
  }
}
