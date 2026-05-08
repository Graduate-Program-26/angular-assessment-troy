import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideDisc, lucideUser } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { DeezerService } from '../../services/deezer.service';
import { DeezerArtist, DeezerAlbum, DeezerTrack } from '../../services/deezer.models';
import { PlayerStore } from '../../store/player.store';
import { PlaylistStore } from '../../store/playlist.store';
import { TrackRowComponent } from '../../shared/track-row/track-row';

interface SearchResults {
  artists: DeezerArtist[];
  albums: DeezerAlbum[];
  songs: DeezerTrack[];
  totals: { artists: number; albums: number; songs: number };
}

const emptyResults: SearchResults = {
  artists: [],
  albums: [],
  songs: [],
  totals: { artists: 0, albums: 0, songs: 0 },
};

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    HlmInputImports,
    HlmSpinnerImports,
    HlmTabsImports,
    HlmButtonImports,
    DecimalPipe,
    SlicePipe,
    TrackRowComponent,
  ],
  providers: [provideIcons({ lucideSearch, lucideDisc, lucideUser })],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly deezer = inject(DeezerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly player = inject(PlayerStore);
  readonly playlistStore = inject(PlaylistStore);

  readonly loading = signal(false);
  readonly loadingMore = signal(false);
  readonly error = signal<string | null>(null);
  readonly query = signal('');
  readonly results = signal<SearchResults>(emptyResults);

  readonly hasResults = computed(() => {
    const r = this.results();
    return r.artists.length > 0 || r.albums.length > 0 || r.songs.length > 0;
  });

  readonly hasMoreArtists = computed(() => {
    const r = this.results();
    return r.artists.length < r.totals.artists;
  });

  readonly hasMoreAlbums = computed(() => {
    const r = this.results();
    return r.albums.length < r.totals.albums;
  });

  readonly hasMoreSongs = computed(() => {
    const r = this.results();
    return r.songs.length < r.totals.songs;
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchToken = 0;

  constructor() {
    this.playlistStore.loadPlaylists();
    this.destroyRef.onDestroy(() => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
    });
  }

  onQueryChange(value: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.performSearch(value.trim()), 800);
  }

  private async performSearch(query: string): Promise<void> {
    const token = ++this.searchToken;
    this.query.set(query);
    this.results.set(emptyResults);
    this.error.set(null);

    if (!query) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    try {
      const [artists, albums, songs] = await Promise.all([
        firstValueFrom(this.deezer.searchArtists(query)),
        firstValueFrom(this.deezer.searchAlbums(query)),
        firstValueFrom(this.deezer.searchTracks(query)),
      ]);

      if (token !== this.searchToken) return;

      this.results.set({
        artists: artists.data,
        albums: albums.data,
        songs: songs.data,
        totals: { artists: artists.total, albums: albums.total, songs: songs.total },
      });
    } catch {
      if (token !== this.searchToken) return;
      this.error.set('Failed to fetch results. Check your connection or proxy config.');
    } finally {
      if (token === this.searchToken) this.loading.set(false);
    }
  }

  async loadMore(type: 'artists' | 'albums' | 'songs'): Promise<void> {
    const q = this.query();
    if (!q || this.loadingMore()) return;
    this.loadingMore.set(true);
    const index = this.results()[type].length;

    try {
      if (type === 'artists') {
        const response = await firstValueFrom(this.deezer.searchArtists(q, 25, index));
        this.results.update((current) => ({
          ...current,
          artists: [...current.artists, ...response.data],
        }));
      } else if (type === 'albums') {
        const response = await firstValueFrom(this.deezer.searchAlbums(q, 25, index));
        this.results.update((current) => ({
          ...current,
          albums: [...current.albums, ...response.data],
        }));
      } else {
        const response = await firstValueFrom(this.deezer.searchTracks(q, 25, index));
        this.results.update((current) => ({
          ...current,
          songs: [...current.songs, ...response.data],
        }));
      }
    } catch {
      this.error.set('Failed to load more results.');
    } finally {
      this.loadingMore.set(false);
    }
  }

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }

  navigateToAlbum(id: number): void {
    this.router.navigate(['/album', id]);
  }

  onAddToPlaylist(event: { track: DeezerTrack; playlistId: number }): void {
    this.playlistStore.addSong({
      title: event.track.title,
      artist: event.track.artist.name,
      playlistId: event.playlistId,
      order: this.playlistStore.activeSongs().length,
      duration: event.track.duration,
      preview: event.track.preview,
    });
  }
}
