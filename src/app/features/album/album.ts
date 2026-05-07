import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucidePause, lucideClock, lucideListPlus, lucideDisc } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { SlicePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DeezerService } from '../../services/deezer.service';
import { DeezerAlbum, DeezerTrack } from '../../services/deezer.models';
import { PlayerStore } from '../../store/player.store';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-album',
  imports: [
    HlmCardImports,
    HlmButtonImports,
    HlmSeparatorImports,
    HlmSpinnerImports,
    HlmDropdownMenuImports,
    NgIcon,
    SlicePipe,
  ],
  providers: [provideIcons({ lucidePlay, lucidePause, lucideClock, lucideListPlus, lucideDisc })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deezer = inject(DeezerService);
  readonly playerStore = inject(PlayerStore);
  readonly playlistStore = inject(PlaylistStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly album = signal<DeezerAlbum | null>(null);
  readonly tracks = signal<DeezerTrack[]>([]);
  readonly hoveredTrack = signal<number | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.playlistStore.loadPlaylists();
    forkJoin({
      album: this.deezer.getAlbum(id),
      tracks: this.deezer.getAlbumTracks(id),
    }).subscribe({
      next: ({ album, tracks }) => {
        this.album.set(album);
        this.tracks.set(tracks.data.map((track) => ({ ...track, album })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load album.');
        this.loading.set(false);
      },
    });
  }

  navigateToArtist(id: number): void {
    this.router.navigate(['/artist', id]);
  }

  playFromStart(): void {
    const trackList = this.tracks();
    if (trackList.length) {
      this.playerStore.toggle(trackList[0], trackList);
    }
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  totalDuration(): string {
    const total = this.tracks().reduce((acc, track) => acc + track.duration, 0);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  }

  addToPlaylist(track: DeezerTrack, playlistId: number | undefined): void {
    if (playlistId === undefined) return;
    this.playlistStore.addSong({
      title: track.title,
      artist: track.artist.name,
      playlistId,
      order: this.playlistStore.activeSongs().length,
      duration: track.duration,
      preview: track.preview,
    });
  }
}
