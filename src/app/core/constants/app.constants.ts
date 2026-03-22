import { PortfolioTemplateId } from '../models/profile.model';

export const STORAGE_KEYS = {
  authToken: 'r2s:auth-token',
  draftAccess: 'r2s:draft-access',
  selectedTemplatePrefix: 'r2s:selected-template:'
} as const;

export const APP_PATHS = {
  dashboard: '/dashboard',
  publicPortfolioBase: '/u'
} as const;

export const SLUG_RULES = {
  minLength: 3,
  maxLength: 40
} as const;

export const DEFAULT_TEMPLATE_ID: PortfolioTemplateId = 'classic';
export const MAX_RESUME_FILE_SIZE_MB = 5;
