import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucidePause, lucideTrash2 } from '@ng-icons/lucide';
import { PlaylistStore } from '../../store/playlist.store';
import { PlayerStore } from '../../store/player.store';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DeezerTrack } from '../../services/deezer.models';
import { FormatDurationPipe } from '../../shared/pipes/format-duration.pipe';

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
  ],
  providers: [provideIcons({ lucidePlay, lucidePause, lucideTrash2 })],
  templateUrl: './playlist-detail.html',
})
export class PlaylistDetail implements OnInit {
  readonly store = inject(PlaylistStore);
  readonly playerStore = inject(PlayerStore);
  readonly route = inject(ActivatedRoute);

  readonly queue = computed<DeezerTrack[]>(() =>
    this.store
      .activeSongs()
      .filter((song) => !!song.preview)
      .map((song) => ({
        id: song.id ?? 0,
        title: song.title,
        duration: song.duration,
        preview: song.preview ?? '',
        rank: 0,
        link: '',
        artist: {
          id: 0,
          name: song.artist,
          picture: '',
          picture_medium: '',
          nb_album: 0,
          nb_fan: 0,
          link: '',
        },
        album: {
          id: 0,
          title: '',
          cover: '',
          cover_medium: '',
          release_date: '',
          nb_tracks: 0,
          link: '',
          artist: {
            id: 0,
            name: song.artist,
            picture: '',
            picture_medium: '',
            nb_album: 0,
            nb_fan: 0,
            link: '',
          },
        },
      })),
  );

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
