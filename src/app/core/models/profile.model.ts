export type PortfolioTemplateId = 'classic' | 'minimal' | 'spotlight';

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ProfileSectionVisibility {
  links: boolean;
  skills: boolean;
  experiences: boolean;
  education: boolean;
  projects: boolean;
}

export interface ProfileSectionState<T> {
  items: T[];
  isDirty?: boolean;
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
  draftAccessToken?: string;
  id: string;
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  links: ProfileLink[];
  socialLinks?: ProfileLink[];
  skills: string[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  sectionVisibility: ProfileSectionVisibility;
  selectedTemplate: PortfolioTemplateId;
  slug?: string;
  status: 'draft' | 'published';
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
