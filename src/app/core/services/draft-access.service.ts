import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/app.constants';

interface StoredDraftAccessMap {
  activeProfileId?: string;
  tokens: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class DraftAccessService {
  private readonly storageKey = STORAGE_KEYS.draftAccess;
  private readonly state = this.readState();

  setActiveProfile(profileId: string, token?: string | null): void {
    this.state.activeProfileId = profileId;
    if (token) {
      this.state.tokens[profileId] = token;
    }
    this.persist();
  }

  rememberDraft(profileId: string, token?: string | null): void {
    if (token) {
      this.state.tokens[profileId] = token;
    }
    this.persist();
  }

  getActiveProfileId(): string | null {
    return this.state.activeProfileId ?? null;
  }

  getToken(profileId: string): string | null {
    return this.state.tokens[profileId] ?? null;
  }

  clearProfile(profileId: string): void {
    delete this.state.tokens[profileId];
    if (this.state.activeProfileId === profileId) {
      delete this.state.activeProfileId;
    }
    this.persist();
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  private readState(): StoredDraftAccessMap {
    if (typeof localStorage === 'undefined') {
      return { tokens: {} };
    }

    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return { tokens: {} };
    }

    try {
      const parsed = JSON.parse(stored) as Partial<StoredDraftAccessMap>;
      return {
        activeProfileId: typeof parsed.activeProfileId === 'string' ? parsed.activeProfileId : undefined,
        tokens: typeof parsed.tokens === 'object' && parsed.tokens ? parsed.tokens as Record<string, string> : {}
      };
    } catch {
      return { tokens: {} };
    }
  }
}
