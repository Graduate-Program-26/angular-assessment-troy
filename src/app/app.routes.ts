import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
    canActivate: [AuthGuard],
  },
  {
    path: 'artist/:id',
    loadComponent: () => import('./features/artist/artist').then((m) => m.Artist),
    canActivate: [AuthGuard],
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./features/album/album').then((m) => m.Album),
    canActivate: [AuthGuard],
  },
  {
    path: 'playlist',
    loadComponent: () =>
      import('./features/playlist-creator/playlist-creator').then((m) => m.PlaylistsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('./features/playlist-detail/playlist-detail').then((m) => m.PlaylistDetail),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
