import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { DraftProfile, PublishRequest, TemplateDefinition } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  constructor(private readonly api: ApiService) {}

  uploadResume(file: File): Observable<{ draftId: string }> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.api.post<{ draftId: string }>('/resumes/upload', formData);
  }

  getDraft(draftId: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(`/drafts/${draftId}`);
  }

  updateDraft(draftId: string, payload: Partial<DraftProfile>): Observable<DraftProfile> {
    return this.api.patch<DraftProfile>(`/drafts/${draftId}`, payload);
  }

  getTemplates(): Observable<TemplateDefinition[]> {
    return of([
      {
        id: 'classic',
        name: 'Classic',
        description: 'Balanced layout for freshers and early-career developers.',
        audience: 'Students & generalist developers',
        accentLabel: 'Professional'
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, content-first presentation with quick scanning.',
        audience: 'Software engineers',
        accentLabel: 'Minimal'
      },
      {
        id: 'spotlight',
        name: 'Spotlight',
        description: 'Project-forward layout that emphasizes work samples and skills.',
        audience: 'Developers with portfolio projects',
        accentLabel: 'Project-led'
      }
    ]);
  }

  checkSlugAvailability(slug: string): Observable<{ available: boolean }> {
    return this.api.get<{ available: boolean }>(`/publish/slug-availability?slug=${encodeURIComponent(slug)}`);
  }

  publishPortfolio(payload: PublishRequest): Observable<{ slug: string }> {
    return this.api.post<{ slug: string }>('/publish', payload);
  }

  getPublicProfile(slug: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(`/public/${slug}`);
  }
}
