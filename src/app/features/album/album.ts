import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucideClock, lucidePause, lucideListPlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { PlaylistStore } from '../../store/playlist.store';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

export interface AlbumTrack {
  position: number;
  title: string;
  duration: string;
  explicit: boolean;
}

export interface AlbumData {
  title: string;
  artistName: string;
  artistImageUrl: string;
  coverUrl: string;
  year: number;
  type: 'Album' | 'EP' | 'Single';
  genre: string;
  totalDuration: string;
  label: string;
}

@Component({
  selector: 'app-album',
  imports: [
    HlmAvatarImports,
    HlmCardImports,
    HlmButtonImports,
    HlmSeparatorImports,
    HlmDropdownMenuImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucidePlay,
      lucideClock,
      lucidePause,
      lucideListPlus,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album implements OnInit {
  readonly playlistStore = inject(PlaylistStore);
  readonly hoveredTrack = signal<number | null>(null);
  readonly playingTrack = signal<number | null>(null);
  readonly isLiked = signal(false);

  readonly album = signal<AlbumData>({
    title: 'Tempor Incididunt',
    artistName: 'Lorem Ipsum',
    artistImageUrl: 'https://i.pravatar.cc/300?img=47',
    coverUrl: 'https://picsum.photos/seed/album1/600/600',
    year: 2024,
    type: 'Album',
    genre: 'Dolor Sit',
    totalDuration: '47 min 36 sec',
    label: 'Amet Records',
  });

  readonly tracks = signal<AlbumTrack[]>([
    {
      position: 1,
      title: 'Sed Do Eiusmod',
      duration: '3:29',

      explicit: false,
    },
    {
      position: 2,
      title: 'Ut Labore Dolore',
      duration: '5:01',

      explicit: true,
    },
    {
      position: 3,
      title: 'Ullamco Laboris Nisi',
      duration: '3:18',
      explicit: false,
    },
    {
      position: 4,
      title: 'Commodo Consequat Duis',
      duration: '3:02',
      explicit: false,
    },
    {
      position: 5,
      title: 'Aute Irure Dolor',
      duration: '6:08',
      explicit: true,
    },
    {
      position: 6,
      title: 'Reprehenderit Voluptate',
      duration: '4:21',
      explicit: false,
    },
    {
      position: 7,
      title: 'Velit Esse Cillum',
      duration: '3:55',
      explicit: false,
    },
    {
      position: 8,
      title: 'Fugiat Nulla Pariatur',
      duration: '4:09',
      explicit: true,
    },
    {
      position: 9,
      title: 'Excepteur Sint Occaecat',
      duration: '5:44',
      explicit: false,
    },
    {
      position: 10,
      title: 'Cupidatat Non Proident',
      duration: '4:29',
      explicit: false,
    },
  ]);

  readonly moreByArtist = signal([
    {
      title: 'Dolor Sit Amet',
      year: 2022,
      cover: 'https://picsum.photos/seed/rel1/300/300',
      type: 'Album',
    },
    {
      title: 'Magna Aliqua EP',
      year: 2023,
      cover: 'https://picsum.photos/seed/rel2/300/300',
      type: 'EP',
    },
    {
      title: 'Aliquip Ex Ea',
      year: 2021,
      cover: 'https://picsum.photos/seed/rel3/300/300',
      type: 'Album',
    },
    {
      title: 'Lorem Ipsum',
      year: 2020,
      cover: 'https://picsum.photos/seed/rel4/300/300',
      type: 'Single',
    },
  ]);

  ngOnInit(): void {
    this.playlistStore.loadPlaylists();
  }

  togglePlay(position: number): void {
    this.playingTrack.update((current) => (current === position ? null : position));
  }

  toggleLike(): void {
    this.isLiked.update((v) => !v);
  }

  addToPlaylist(track: AlbumTrack, playlistId: number): void {
    const [minutes, seconds] = track.duration.split(':').map(Number);
    const order = this.playlistStore.activeSongs().length;
    this.playlistStore.addSong({
      title: track.title,
      artist: this.album().artistName,
      playlistId,
      order,
      duration: minutes * 60 + seconds,
    });
  }
}
