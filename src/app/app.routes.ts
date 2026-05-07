import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
  },
  {
    path: 'artist/:id',
    loadComponent: () => import('./features/artist/artist').then((m) => m.Artist),
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./features/album/album').then((m) => m.Album),
  },
  {
    path: 'playlist',
    loadComponent: () =>
      import('./features/playlist-creator/playlist-creator').then((m) => m.PlaylistsComponent),
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('./features/playlist-detail/playlist-detail').then((m) => m.PlaylistDetail),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
