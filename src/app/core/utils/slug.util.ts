import { SLUG_RULES } from '../constants/app.constants';

export function slugifyProfileName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, SLUG_RULES.maxLength);
}

export function buildSlugSuggestions(baseSlug: string, year = new Date().getUTCFullYear()): string[] {
  return [
    `${baseSlug}-dev`,
    `${baseSlug}-portfolio`,
    `${baseSlug}-${year}`
  ].slice(0, 3);
}
