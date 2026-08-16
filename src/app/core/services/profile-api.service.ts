import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap, map, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { API_ROUTES } from '../config/api-routes';
import {
  DraftProfile,
  ResumeParseResponse,
  ResumeUploadResponse,
  TemplateDefinition
} from '../models/profile.model';
import { DraftAccessService } from './draft-access.service';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  constructor(
    private readonly api: ApiService,
    private readonly draftAccess: DraftAccessService,
    private readonly authApi: AuthApiService
  ) {}

  uploadResume(file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<ResumeUploadResponse>(API_ROUTES.resume.upload, formData);
  }

  parseResume(resumeUploadId: string): Observable<ResumeParseResponse> {
    return this.api.post(API_ROUTES.resume.parse(resumeUploadId), {}).pipe(
      map((resp: any) => {
        const profileId = resp?.profile?.id?.toString() ?? resp?.profileId ?? resp?.id?.toString();
        const draftAccessToken = resp?.profile?.draftToken ?? resp?.profile?.draftAccessToken ?? resp?.draftToken;
        return { profileId, draftAccessToken } as ResumeParseResponse;
      }),
      tap(({ profileId, draftAccessToken }) => {
        if (profileId) {
          this.draftAccess.setActiveProfile(profileId, draftAccessToken);
        }
      })
    );
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
    return this.api.get<DraftProfile>(API_ROUTES.profile.get(profileId), this.withDraftAccess(profileId)).pipe(
      tap((profile: any) => this.draftAccess.setActiveProfile(profile.id || profileId, profile.draftAccessToken ?? profile.draftToken))
    );
  }

  getDashboardProfiles(): Observable<DraftProfile[]> {
    return this.api.get<DraftProfile[]>(API_ROUTES.profile.list).pipe(
      // If the backend does not expose a profiles list endpoint, try fetching the single profile
      // using the logged-in user's id (backend may expose profiles as /profiles/{id}).
      catchError(() => this.authApi.me().pipe(
        switchMap((user) => this.getDraft(user.id)),
        map((profile) => profile ? [profile] : []),
        catchError(() => of([] as DraftProfile[]))
      ))
    );
  }

  updateDraft(profileId: string, payload: Partial<DraftProfile>): Observable<DraftProfile> {
    // If payload contains a string `templateId` (frontend template key), resolve it
    // to the backend numeric template id before sending the update.
    const maybeTemplateId = (payload as any)?.templateId;
    if (typeof maybeTemplateId === 'string' && maybeTemplateId && isNaN(Number(maybeTemplateId))) {
      return this.resolveTemplateId(maybeTemplateId).pipe(
        switchMap((resolvedId) => {
          const normalized = { ...payload, templateId: resolvedId } as Partial<DraftProfile>;
          return this.api.put<DraftProfile>(API_ROUTES.profile.update(profileId), normalized, this.withDraftAccess(profileId));
        }),
        tap((profile: any) => this.draftAccess.rememberDraft(profile.id || profileId, profile.draftAccessToken ?? profile.draftToken))
      );
    }

    // templateId is either numeric or absent — send directly
    return this.api.put<DraftProfile>(API_ROUTES.profile.update(profileId), payload, this.withDraftAccess(profileId)).pipe(
      tap((profile: any) => this.draftAccess.rememberDraft(profile.id || profileId, profile.draftAccessToken ?? profile.draftToken))
    );
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
    return this.api.get(`${API_ROUTES.slug.check}?value=${encodeURIComponent(slug)}`).pipe(
      map((resp: any) => ({ available: !!resp?.available, suggestions: resp?.suggestions ?? [] }))
    );
  }

  publishPortfolio(profileId: string, payload: { slug: string }): Observable<{ slug: string; publicUrl?: string }> {
    // Backend `PublishProfileRequest` accepts only `slug`. Template must be set
    // on the profile via `PUT /api/profiles/{id}` prior to publishing.
    return this.api.post(API_ROUTES.profile.publish(profileId), { slug: payload.slug }, this.withDraftAccess(profileId));
  }

  republishPortfolio(profileId: string, payload: { slug: string }): Observable<{ slug: string; publicUrl?: string }> {
    return this.api.post(API_ROUTES.profile.republish(profileId), { slug: payload.slug }, this.withDraftAccess(profileId));
  }

  getPublicProfile(slug: string): Observable<DraftProfile> {
    return this.api.get<DraftProfile>(API_ROUTES.public.profileBySlug(slug));
  }

  rememberDraftAccess(profileId: string, token?: string | null): void {
    this.draftAccess.setActiveProfile(profileId, token);
  }

  private withDraftAccess(profileId: string): { headers?: Record<string, string> } {
    const token = this.draftAccess.getToken(profileId);
    return token ? { headers: { 'X-Draft-Token': token } } : {};
  }

  private resolveTemplateId(templateIdentifier: string): Observable<number> {
    // If the identifier is numeric-like, return it as a number.
    const numeric = Number(templateIdentifier);
    if (!isNaN(numeric)) {
      return of(Math.trunc(numeric));
    }

    // Otherwise fetch templates from backend and try to match by code or include.
    return this.api.get<{ id: number; code?: string }[]>(API_ROUTES.templates.list).pipe(
      map((templates: any[]) => {
        const found = templates.find((t) => t.code === templateIdentifier || (t.code && t.code.includes(templateIdentifier)) || (templateIdentifier && templateIdentifier.includes(t.code || '')));
        if (!found) {
          throw new Error(`Unable to resolve template identifier '${templateIdentifier}' to a backend template id`);
        }
        return Number(found.id);
      })
    );
  }
}
