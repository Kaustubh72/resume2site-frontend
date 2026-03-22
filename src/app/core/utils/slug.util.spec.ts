import { buildSlugSuggestions, slugifyProfileName } from './slug.util';

describe('slug utilities', () => {
  it('slugifies names into lowercase hyphenated strings', () => {
    expect(slugifyProfileName('  Jane Doe, Frontend Engineer!  ')).toBe('jane-doe-frontend-engineer');
  });

  it('builds deterministic fallback suggestions', () => {
    expect(buildSlugSuggestions('jane-doe', 2030)).toEqual([
      'jane-doe-dev',
      'jane-doe-portfolio',
      'jane-doe-2030'
    ]);
  });
});
