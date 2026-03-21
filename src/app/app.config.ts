import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling
} from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { API_BASE_URL } from './core/config/app.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withInterceptors([])),
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl
    }
  ]
};
