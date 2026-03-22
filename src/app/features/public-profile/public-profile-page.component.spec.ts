import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { PublicProfilePageComponent } from './public-profile-page.component';
import { ProfileApiService } from '../../core/services/profile-api.service';

describe('PublicProfilePageComponent', () => {
  const profileApi = jasmine.createSpyObj<ProfileApiService>('ProfileApiService', ['getPublicProfile']);
  const title = jasmine.createSpyObj<Title>('Title', ['setTitle']);

  beforeEach(async () => {
    profileApi['getPublicProfile'].calls.reset();
    title['setTitle'].calls.reset();

    await TestBed.configureTestingModule({
      imports: [PublicProfilePageComponent],
      providers: [
        { provide: ProfileApiService, useValue: profileApi },
        { provide: Title, useValue: title },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'slug' ? 'missing-user' : null
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('shows a not-found state for a 404 slug response', () => {
    profileApi['getPublicProfile'].and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    const fixture = TestBed.createComponent(PublicProfilePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Portfolio not found');
  });

  it('renders the public profile when the slug resolves', () => {
    profileApi['getPublicProfile'].and.returnValue(of({
      id: 'profile-1',
      fullName: 'Jane Doe',
      headline: 'Frontend Engineer',
      summary: 'Builds reliable product UI.',
      email: 'jane@example.com',
      links: [],
      skills: [],
      experiences: [],
      education: [],
      projects: [],
      sectionVisibility: { links: true, skills: true, experiences: true, education: true, projects: true },
      selectedTemplate: 'classic',
      status: 'published'
    } as any));

    const fixture = TestBed.createComponent(PublicProfilePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Jane Doe');
    expect(title['setTitle']).toHaveBeenCalledWith('Jane Doe | Resume2Site');
  });
});
