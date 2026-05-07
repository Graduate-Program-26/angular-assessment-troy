import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { Subscription, debounceTime, distinctUntilChanged, forkJoin, switchMap } from 'rxjs';
import { DeezerService } from '../../services/deezer.service';
import { DeezerArtist, DeezerAlbum, DeezerTrack } from '../../services/deezer.models';
import { PlayerStore } from '../../store/player.store';
import { FormatDurationPipe } from '../../shared/pipes/format-duration.pipe';

interface SearchResults {
  artists: DeezerArtist[];
  albums: DeezerAlbum[];
  songs: DeezerTrack[];
}

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmInputImports,
    HlmCardImports,
    HlmSpinnerImports,
    HlmTabsImports,
    DecimalPipe,
    DatePipe,
    FormatDurationPipe,
  ],
  providers: [
    provideIcons({ lucideSearch, lucideMusic, lucideDisc, lucideUser, lucidePlay, lucidePause }),
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit, OnDestroy {
  private readonly deezer = inject(DeezerService);
  private readonly router = inject(Router);
  readonly player = inject(PlayerStore);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly results = signal<SearchResults>({ artists: [], albums: [], songs: [] });

  readonly hasResults = computed(() => {
    const r = this.results();
    return r.artists.length > 0 || r.albums.length > 0 || r.songs.length > 0;
  });

  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((query) => {
          const trimmed = query.trim();
          this.results.set({ artists: [], albums: [], songs: [] });
          this.error.set(null);

          if (!trimmed) {
            this.loading.set(false);
            return [];
          }

          this.loading.set(true);
          return forkJoin({
            artists: this.deezer.searchArtists(trimmed),
            albums: this.deezer.searchAlbums(trimmed),
            songs: this.deezer.searchTracks(trimmed),
          });
        }),
      )
      .subscribe({
        next: ({ artists, albums, songs }) => {
          this.results.set({ artists: artists.data, albums: albums.data, songs: songs.data });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to fetch results. Check your connection or proxy config.');
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }

  navigateToAlbum(id: number): void {
    this.router.navigate(['/album', id]);
  }
}
