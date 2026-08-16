export type PortfolioTemplateId = 'classic' | 'minimal' | 'spotlight';

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  sortOrder?: number;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  sortOrder?: number;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  role?: string; // backward compatibility
  location?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
  summary?: string; // backward compatibility
  highlights?: string[]; // backward compatibility
  sortOrder?: number;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  field?: string; // backward compatibility
  startDate?: string;
  endDate?: string;
  grade?: string;
  score?: string; // backward compatibility
  description?: string;
  sortOrder?: number;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description?: string;
  projectUrl?: string;
  link?: string; // backward compatibility
  repositoryUrl?: string;
  techStack?: string;
  technologies?: string[]; // backward compatibility
  sortOrder?: number;
}

export interface ProfileSection {
  sectionKey: string;
  displayName: string;
  visible: boolean;
  sortOrder?: number;
}

// Backward compatibility
export interface ProfileSectionVisibility {
  links: boolean;
  skills: boolean;
  experiences: boolean;
  education: boolean;
  projects: boolean;
}

export interface ResumeUploadData {
  id: number;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  parseStatus: string;
}

export interface ResumeUploadResponse {
  data: ResumeUploadData;
  resumeUploadId?: string;
}

export interface ResumeParseResponse {
  profileId: string;
  draftAccessToken?: string;
}

export interface DraftProfile {
  id: string;
  draftToken?: string;
  draftAccessToken?: string;
  fullName: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  publicationStatus?: 'DRAFT' | 'PUBLISHED';
  status: 'draft' | 'published'; // backward compatibility - defaults to draft if not set
  slug?: string;
  templateId?: string;
  selectedTemplate: PortfolioTemplateId; // backward compatibility
  sections?: ProfileSection[];
  sectionVisibility: ProfileSectionVisibility; // backward compatibility - always available
  links: ProfileLink[];
  skills: (Skill | string)[]; // accept both Skill objects and strings for backward compatibility
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  website?: string; // backward compatibility - not in API
  socialLinks?: ProfileLink[]; // backward compatibility - not in API
  updatedAt?: string;
}

export interface TemplateDefinition {
  id: PortfolioTemplateId;
  name: string;
  description: string;
  audience: string;
  accentLabel: string;
  thumbnailLabel?: string;
  highlights?: string[];
}

export interface PublishRequest {
  draftId: string;
  slug: string;
  template: PortfolioTemplateId;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
