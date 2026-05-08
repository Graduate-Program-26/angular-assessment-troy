import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideDisc } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DeezerService } from '../../services/deezer.service';
import { DeezerAlbum, DeezerArtist, DeezerTrack } from '../../services/deezer.models';
import { PlayerStore } from '../../store/player.store';
import { PlaylistStore } from '../../store/playlist.store';
import { TrackRowComponent } from '../../shared/track-row/track-row';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-artist-page',
  imports: [
    HlmCardImports,
    HlmButtonImports,
    HlmSpinnerImports,
    NgIcon,
    DecimalPipe,
    SlicePipe,
    TrackRowComponent,
    BreadcrumbComponent,
  ],
  providers: [provideIcons({ lucideChevronDown, lucideDisc })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './artist.html',
})
export class Artist implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deezer = inject(DeezerService);
  readonly playerStore = inject(PlayerStore);
  readonly playlistStore = inject(PlaylistStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly artist = signal<DeezerArtist | null>(null);
  readonly topTracks = signal<DeezerTrack[]>([]);
  readonly albums = signal<DeezerAlbum[]>([]);

  readonly tracksLimit = signal(5);
  readonly albumsLimit = signal(6);

  readonly visibleTracks = computed(() => this.topTracks().slice(0, this.tracksLimit()));
  readonly visibleAlbums = computed(() => this.albums().slice(0, this.albumsLimit()));
  readonly hasMoreTracks = computed(() => this.topTracks().length > this.tracksLimit());
  readonly hasMoreAlbums = computed(() => this.albums().length > this.albumsLimit());

  readonly artistGenres = computed(() => {
    const seen = new Set<string>();
    const genres: string[] = [];
    for (const album of this.albums()) {
      for (const genre of album.genres?.data ?? []) {
        if (!seen.has(genre.name)) {
          seen.add(genre.name);
          genres.push(genre.name);
        }
      }
    }
    return genres;
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const artistData = this.artist();
    return [{ label: 'Search', route: ['/'] }, ...(artistData ? [{ label: artistData.name }] : [])];
  });

  ngOnInit(): void {
    const artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.playlistStore.loadPlaylists();
    forkJoin({
      artist: this.deezer.getArtist(artistId),
      tracks: this.deezer.getArtistTopTracks(artistId),
      albums: this.deezer.getArtistAlbums(artistId),
    }).subscribe({
      next: ({ artist, tracks, albums }) => {
        this.artist.set(artist);
        this.topTracks.set(tracks.data);
        this.albums.set(albums.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load artist.');
        this.loading.set(false);
      },
    });
  }

  showMoreTracks(): void {
    this.tracksLimit.update((current) => current + 5);
  }

  showMoreAlbums(): void {
    this.albumsLimit.update((current) => current + 6);
  }

  navigateToAlbum(albumId: number): void {
    this.router.navigate(['/album', albumId]);
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
