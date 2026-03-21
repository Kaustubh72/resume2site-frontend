import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import {
  DraftProfile,
  PublishRequest,
  ResumeParseResponse,
  ResumeUploadResponse,
  TemplateDefinition
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  constructor(private readonly api: ApiService) {}

  uploadResume(file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.api.post<ResumeUploadResponse>('/resumes/upload', formData);
  }

  parseResume(resumeUploadId: string): Observable<ResumeParseResponse> {
    return this.api.post<ResumeParseResponse>(`/resumes/${resumeUploadId}/parse`, {});
  }

  uploadAndParseResume(file: File): Observable<ResumeParseResponse> {
    return this.uploadResume(file).pipe(
      switchMap(({ resumeUploadId }) => this.parseResume(resumeUploadId))
    );
  }

  getDraft(profileId: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(`/drafts/${profileId}`);
  }

  updateDraft(profileId: string, payload: Partial<DraftProfile>): Observable<DraftProfile> {
    return this.api.patch<DraftProfile>(`/drafts/${profileId}`, payload);
  }

  getTemplates(): Observable<TemplateDefinition[]> {
    return of([
      {
        id: 'classic',
        name: 'Classic',
        description: 'Balanced layout for freshers and early-career developers.',
        audience: 'Students & generalist developers',
        accentLabel: 'Professional',
        thumbnailLabel: 'Professional hero + sidebar',
        highlights: ['Balanced summary and experience', 'Strong default for resumes', 'Works well for mixed backgrounds']
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, content-first presentation with quick scanning.',
        audience: 'Software engineers',
        accentLabel: 'Minimal',
        thumbnailLabel: 'Editorial and content-first',
        highlights: ['High readability', 'Compact layout', 'Clean mobile preview']
      },
      {
        id: 'spotlight',
        name: 'Spotlight',
        description: 'Project-forward layout that emphasizes work samples and skills.',
        audience: 'Developers with portfolio projects',
        accentLabel: 'Project-led',
        thumbnailLabel: 'Featured projects first',
        highlights: ['Project-heavy hero', 'Distinct visual style', 'Built for portfolio-first candidates']
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
