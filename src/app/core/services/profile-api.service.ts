import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { API_ROUTES } from '../config/api-routes';
import {
  DraftProfile,
  ResumeParseResponse,
  ResumeUploadResponse,
  TemplateDefinition
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  constructor(private readonly api: ApiService) {}

  uploadResume(file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<ResumeUploadResponse>(API_ROUTES.resume.upload, formData);
  }

  parseResume(resumeUploadId: string): Observable<ResumeParseResponse> {
    return this.api.post<ResumeParseResponse>(API_ROUTES.resume.parse(resumeUploadId), {});
  }

  uploadAndParseResume(file: File): Observable<ResumeParseResponse> {
    return this.uploadResume(file).pipe(
      switchMap((uploadResponse) => {
        const typed = uploadResponse as ResumeUploadResponse;
        const resumeUploadId =
          typed.resumeUploadId ||
          typed.data?.id?.toString() ||
          ((uploadResponse as unknown as { id?: string }).id ?? '');

        if (!resumeUploadId) {
          throw new Error('uploadAndParseResume: resumeUploadId is missing in /resumes/upload response');
        }

        return this.parseResume(resumeUploadId);
      })
    );
  }

  getDraft(profileId: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(API_ROUTES.profile.get(profileId));
  }

  getDashboardProfiles(): Observable<DraftProfile[]> {
    return this.api.get<DraftProfile[]>(API_ROUTES.profile.list);
  }

  updateDraft(profileId: string, payload: Partial<DraftProfile>): Observable<DraftProfile> {
    // backend API currently uses PUT /api/profiles/{profileId}; patch preserved for partial updates in future
    return this.api.patch<DraftProfile>(API_ROUTES.profile.update(profileId), payload);
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

  checkSlugAvailability(slug: string): Observable<{ available: boolean; suggestions?: string[] }> {
    return this.api.get<{ available: boolean; suggestions?: string[] }>(`${API_ROUTES.slug.check}?value=${encodeURIComponent(slug)}`);
  }

  publishPortfolio(profileId: string, payload: { slug: string }): Observable<{ slug: string; publicUrl?: string }> {
    return this.api.post<{ slug: string; publicUrl?: string }>(API_ROUTES.profile.publish(profileId), payload);
  }

  republishPortfolio(profileId: string, payload: { slug: string }): Observable<{ slug: string; publicUrl?: string }> {
    return this.api.post<{ slug: string; publicUrl?: string }>(API_ROUTES.profile.republish(profileId), payload);
  }

  getPublicProfile(slug: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(API_ROUTES.public.profileBySlug(slug));
  }
}
