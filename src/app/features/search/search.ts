import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideMusic,
  lucideDisc,
  lucideUser,
  lucidePlay,
  lucidePause,
} from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DeezerService } from '../../services/deezer.service';
import { DeezerArtist, DeezerAlbum, DeezerTrack } from '../../services/deezer.models';
import { PlayerStore } from '../../store/player.store';

interface SearchResults {
  artists: DeezerArtist[];
  albums: DeezerAlbum[];
  songs: DeezerTrack[];
}

@Component({
  selector: 'app-search',
  imports: [
    NgIcon,
    HlmInputImports,
    HlmCardImports,
    HlmSpinnerImports,
    HlmTabsImports,
    DecimalPipe,
    DatePipe,
  ],
  providers: [
    provideIcons({ lucideSearch, lucideMusic, lucideDisc, lucideUser, lucidePlay, lucidePause }),
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly deezer = inject(DeezerService);
  private readonly router = inject(Router);
  readonly player = inject(PlayerStore);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly results = signal<SearchResults>({ artists: [], albums: [], songs: [] });

  readonly hasResults = computed(() => {
    const r = this.results();
    return r.artists.length > 0 || r.albums.length > 0 || r.songs.length > 0;
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }
  navigateToAlbum(id: number): void {
    this.router.navigate(['/album', id]);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    this.results.set({ artists: [], albums: [], songs: [] });
    this.error.set(null);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (!value) return;

    this.loading.set(true);

    this.debounceTimer = setTimeout(() => {
      forkJoin({
        artists: this.deezer.searchArtists(value),
        albums: this.deezer.searchAlbums(value),
        songs: this.deezer.searchTracks(value),
      }).subscribe({
        next: ({ artists, albums, songs }) => {
          this.results.set({ artists: artists.data, albums: albums.data, songs: songs.data });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to fetch results. Check your connection or proxy config.');
          this.loading.set(false);
        },
      });
    }, 800);
  }
}
