import { Routes } from '@angular/router';
import { authPlaceholderGuard } from './core/guards/auth-placeholder.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent)
  },
  {
    path: 'upload',
    loadComponent: () => import('./features/upload/upload-page.component').then((m) => m.UploadPageComponent)
  },
  {
    path: 'draft/:draftId',
    loadComponent: () => import('./features/draft-editor/draft-editor-page.component').then((m) => m.DraftEditorPageComponent)
  },
  {
    path: 'templates/:draftId',
    loadComponent: () => import('./features/templates/template-gallery-page.component').then((m) => m.TemplateGalleryPageComponent)
  },
  {
    path: 'templates/:draftId/preview/:templateId',
    loadComponent: () => import('./features/templates/template-preview-page.component').then((m) => m.TemplatePreviewPageComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-page.component').then((m) => m.AuthPageComponent)
  },
  {
    path: 'publish/:draftId',
    loadComponent: () => import('./features/publish/publish-page.component').then((m) => m.PublishPageComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authPlaceholderGuard],
    loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'u/:slug',
    loadComponent: () => import('./features/public-profile/public-profile-page.component').then((m) => m.PublicProfilePageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
