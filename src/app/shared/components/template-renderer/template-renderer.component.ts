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
                  <p class="eyebrow">{{ currentProfile.headline }}</p>
                  <h1>{{ currentProfile.fullName }}</h1>
                  <p class="lead">{{ currentProfile.summary }}</p>
                </div>
                <div class="hero-aside compact-card">
                  <div><strong>Email</strong><span>{{ currentProfile.email }}</span></div>
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
                  <h1>{{ currentProfile.fullName }}</h1>
                  <p class="lead">{{ currentProfile.headline }}</p>
                  <p>{{ currentProfile.summary }}</p>
                  <div class="hero-links">
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
                  <h1>{{ currentProfile.fullName }}</h1>
                  <p class="lead">{{ currentProfile.headline }}</p>
                </div>
                <div class="hero-contact">
                  <span>{{ currentProfile.email }}</span>
                  <span *ngIf="currentProfile.phone">{{ currentProfile.phone }}</span>
                  <span *ngIf="currentProfile.location">{{ currentProfile.location }}</span>
                </div>
              </header>

              <div class="intro-card compact-card">
                <p>{{ currentProfile.summary }}</p>
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
            </section>
          </ng-container>
        </ng-container>
      </article>
    </ng-container>
  `,
  styles: [`
    .preview-canvas { background: #fff; color: #0f172a; border-radius: 28px; overflow: hidden; box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12); margin: 0 auto; }
    .preview-canvas.desktop { width: min(100%, 980px); min-height: 960px; }
    .preview-canvas.mobile { width: min(100%, 420px); min-height: 780px; }
    .template-shell, .content-grid, .main-stack, .sidebar-stack, .timeline-list, .stack-list, .project-grid { display: grid; gap: 1.5rem; }
    .template-shell { padding: 2rem; }
    .hero { display: grid; gap: 1.5rem; }
    .classic-hero, .spotlight-hero { grid-template-columns: minmax(0, 1.5fr) minmax(220px, 0.8fr); align-items: start; }
    .minimal-hero { grid-template-columns: minmax(0, 1.6fr) minmax(220px, 0.75fr); align-items: stretch; }
    .eyebrow, .template-kicker, small { color: #64748b; }
    h1, h3, p { margin: 0; }
    h1 { font-size: clamp(2rem, 4vw, 3.35rem); line-height: 1.02; letter-spacing: -0.05em; }
    h3 { font-size: 1.05rem; }
    .lead { font-size: 1.05rem; color: #334155; }
    .hero-contact, .hero-aside, .metrics-panel, .link-row, .tag-row, .hero-links { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .hero-aside { flex-direction: column; }
    .hero-aside div { display: grid; gap: 0.2rem; }
    .hero-contact span, .link-row a, .hero-links a, .tag-row span, .chip-row span { display: inline-flex; align-items: center; padding: 0.55rem 0.85rem; border-radius: 999px; font-weight: 600; }
    .hero-contact span { background: #eef2ff; color: #3730a3; }
    .link-row a, .hero-links a { background: #eff6ff; color: #1d4ed8; }
    .tag-row span, .chip-row span { background: #f8fafc; border: 1px solid #e2e8f0; }
    .compact-card, .accent-card, .accent-panel, .metrics-panel { border-radius: 24px; padding: 1.25rem; }
    .compact-card { background: #f8fafc; border: 1px solid #e2e8f0; }
    .intro-card p { color: #334155; line-height: 1.7; }
    .classic-grid, .spotlight-grid { grid-template-columns: minmax(0, 1.5fr) minmax(250px, 0.8fr); align-items: start; }
    .single-column { grid-template-columns: 1fr; }
    .timeline-item, .project-card { display: grid; gap: 0.8rem; }
    .timeline-head, .project-topline { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
    ul { margin: 0; padding-left: 1rem; color: #475569; }
    .minimal-shell { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
    .minimal-hero { padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
    .classic-shell { background: linear-gradient(180deg, #eef2ff 0%, #ffffff 30%); }
    .spotlight-shell { background: #0f172a; color: #e2e8f0; }
    .spotlight-shell .lead, .spotlight-shell p, .spotlight-shell small { color: #cbd5e1; }
    .accent-panel { background: linear-gradient(135deg, #1d4ed8, #7c3aed); color: white; }
    .accent-panel p, .accent-panel .lead, .accent-panel .template-kicker { color: rgba(255,255,255,0.92); }
    .metrics-panel { background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(148, 163, 184, 0.2); display: grid; gap: 1rem; }
    .metrics-panel div { display: grid; gap: 0.25rem; }
    .metrics-panel strong { font-size: 2rem; }
    .accent-card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); }
    .spotlight-shell .tag-row span { background: rgba(30, 41, 59, 0.85); border-color: rgba(148, 163, 184, 0.22); color: #e2e8f0; }
    .chip-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .tall-tags { align-items: flex-start; }
    @media (max-width: 900px) {
      .classic-hero, .spotlight-hero, .minimal-hero, .classic-grid, .spotlight-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .template-shell { padding: 1.25rem; }
      .timeline-head, .project-topline { flex-direction: column; }
    }
  `]
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
