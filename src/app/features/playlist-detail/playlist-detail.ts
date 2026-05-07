import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucidePause } from '@ng-icons/lucide';
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
  providers: [provideIcons({ lucidePlay, lucidePause })],
  templateUrl: './playlist-detail.html',
})
export class PlaylistDetail implements OnInit {
  readonly store = inject(PlaylistStore);
  readonly playerStore = inject(PlayerStore);
  readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadPlaylists();
    this.store.selectPlaylist(id);
  }

  asQueue(): DeezerTrack[] {
    return this.store
      .activeSongs()
      .filter((s) => !!s.preview)
      .map((s) => ({
        id: s.id ?? 0,
        title: s.title,
        duration: s.duration,
        preview: s.preview ?? '',
        rank: 0,
        link: '',
        artist: {
          id: 0,
          name: s.artist,
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
            name: s.artist,
            picture: '',
            picture_medium: '',
            nb_album: 0,
            nb_fan: 0,
            link: '',
          },
        },
      }));
  }

  playSong(index: number): void {
    const queue = this.asQueue();
    if (!queue[index]) return;
    this.playerStore.toggle(queue[index], queue);
  }

  isSongPlaying(songId: number | undefined): boolean {
    return !!songId && this.playerStore.isCurrentTrack(songId) && this.playerStore.isPlaying();
  }
}
