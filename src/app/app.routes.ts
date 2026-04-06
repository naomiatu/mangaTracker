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
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  
  {
    path: 'category-list/:type',
    loadComponent: () => import('./pages/category-list/category-list.page').then( m => m.CategoryListPage)
  },
  {
    path: 'discovery',
    loadComponent: () => import('./pages/discovery/discovery.page').then( m => m.DiscoveryPage)
  }
];