import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { API_BASE_URL } from './core/config/app.tokens';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

const noopInterceptor = withInterceptors([]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(noopInterceptor),
    {
      provide: API_BASE_URL,
      useValue: isDevMode() ? environment.apiBaseUrl : environment.apiBaseUrl
    }
  ]
};
