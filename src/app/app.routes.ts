import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'manga-details/:id',
    loadComponent: () => import('./pages/manga-details/manga-details.page').then(m => m.MangaDetailsPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'manga-details',
    loadComponent: () => import('./pages/manga-details/manga-details.page').then( m => m.MangaDetailsPage)
  },
];