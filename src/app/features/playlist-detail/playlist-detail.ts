import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucidePause, lucideTrash2 } from '@ng-icons/lucide';
import { PlaylistStore } from '../../store/playlist.store';
import { PlayerStore, PlayableTrack } from '../../store/player.store';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Song } from '../../db/db';
import { FormatDurationPipe } from '../../shared/pipes/format-duration.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb';

type StoredSong = Song & { id: number; preview: string };

function isPlayable(song: Song): song is StoredSong {
  return song.id !== undefined && !!song.preview;
}

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCardImports,
    HlmSeparator,
    HlmBadgeImports,
    HlmButtonImports,
    NgIcon,
    FormatDurationPipe,
    BreadcrumbComponent,
  ],
  providers: [provideIcons({ lucidePlay, lucidePause, lucideTrash2 })],
  templateUrl: './playlist-detail.html',
})
export class PlaylistDetail implements OnInit {
  readonly store = inject(PlaylistStore);
  readonly playerStore = inject(PlayerStore);
  readonly route = inject(ActivatedRoute);

  readonly queue = computed<PlayableTrack[]>(() =>
    this.store
      .activeSongs()
      .filter(isPlayable)
      .map((song) => ({
        id: song.id,
        title: song.title,
        preview: song.preview,
        duration: song.duration,
        artist: { name: song.artist },
      })),
  );

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const playlist = this.store.activePlaylist();
    return [
      { label: 'Playlists', route: ['/playlist'] },
      ...(playlist ? [{ label: playlist.name }] : []),
    ];
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadPlaylists();
    this.store.selectPlaylist(id);
  }

  playSong(index: number): void {
    const trackQueue = this.queue();
    if (!trackQueue[index]) return;
    this.playerStore.toggle(trackQueue[index], trackQueue);
  }

  removeSong(event: Event, songId: number | undefined): void {
    event.stopPropagation();
    const playlistId = this.store.activePlaylistId();
    if (songId === undefined || playlistId === null) return;
    this.store.removeSong(songId, playlistId);
  }

  isSongPlaying(songId: number | undefined): boolean {
    return !!songId && this.playerStore.isCurrentTrack(songId) && this.playerStore.isPlaying();
  }
}
