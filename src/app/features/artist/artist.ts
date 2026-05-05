import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePlay,
  lucideHeart,
  lucideMoreHorizontal,
  lucideClock,
  lucideChevronDown,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

export interface Track {
  position: number;
  title: string;
  album: string;
  duration: string;
  plays: string;
}

export interface Album {
  title: string;
  year: number;
  type: 'Album' | 'EP' | 'Single';
  cover: string;
  trackCount: number;
}

@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [HlmAvatarImports, HlmCardImports, HlmButtonImports, NgIcon],
  providers: [
    provideIcons({ lucidePlay, lucideHeart, lucideMoreHorizontal, lucideClock, lucideChevronDown }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './artist.html',
})
export class Artist {
  readonly tracksLimit = signal(5);
  readonly albumsLimit = signal(6);

  readonly visibleTracks = computed(() => this.topTracks().slice(0, this.tracksLimit()));
  readonly visibleAlbums = computed(() => this.albums().slice(0, this.albumsLimit()));

  readonly hasMoreTracks = computed(() => this.topTracks().length > this.tracksLimit());
  readonly hasMoreAlbums = computed(() => this.albums().length > this.albumsLimit());

  showMoreTracks(): void {
    this.tracksLimit.update((n) => n + 5);
  }

  showMoreAlbums(): void {
    this.albumsLimit.update((n) => n + 6);
  }

  readonly artist = signal({
    name: 'Lorem Ipsum',
    genre: 'Dolor Sit | Amet Consectetur',
    monthlyListeners: '1,234,567',
    followers: '2.4M',
    imageUrl: 'https://i.pravatar.cc/300?img=47',
    initials: 'LI',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.',
  });

  readonly topTracks = signal<Track[]>([
    {
      position: 1,
      title: 'Lorem Ipsum',
      album: 'Dolor Sit Amet',
      duration: '3:47',
      plays: '94,201,441',
    },
    {
      position: 2,
      title: 'Consectetur Adipiscing',
      album: 'Dolor Sit Amet',
      duration: '4:12',
      plays: '72,884,009',
    },
    {
      position: 3,
      title: 'Sed Do Eiusmod',
      album: 'Tempor Incididunt',
      duration: '3:29',
      plays: '61,337,882',
    },
    {
      position: 4,
      title: 'Ut Labore Dolore',
      album: 'Tempor Incididunt',
      duration: '5:01',
      plays: '48,110,230',
    },
    {
      position: 5,
      title: 'Magna Aliqua Enim',
      album: 'Magna Aliqua EP',
      duration: '3:55',
      plays: '41,009,774',
    },
    {
      position: 6,
      title: 'Quis Nostrud Exercitation',
      album: 'Dolor Sit Amet',
      duration: '4:33',
      plays: '38,450,101',
    },
    {
      position: 7,
      title: 'Ullamco Laboris Nisi',
      album: 'Tempor Incididunt',
      duration: '3:18',
      plays: '29,876,543',
    },
    {
      position: 8,
      title: 'Aliquip Ex Ea',
      album: 'Aliquip Ex Ea',
      duration: '4:44',
      plays: '24,562,118',
    },
    {
      position: 9,
      title: 'Commodo Consequat Duis',
      album: 'Tempor Incididunt',
      duration: '3:02',
      plays: '19,334,009',
    },
    {
      position: 10,
      title: 'Aute Irure Dolor',
      album: 'Magna Aliqua EP',
      duration: '6:08',
      plays: '15,220,448',
    },
  ]);

  readonly albums = signal<Album[]>([
    {
      title: 'Dolor Sit Amet',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Tempor Incididunt',
      year: 2022,
      type: 'Album',
      cover: 'https://picsum.photos/seed/sd/200',
      trackCount: 10,
    },
    {
      title: 'Aliquip Ex Ea',
      year: 2021,
      type: 'Single',
      cover: 'https://picsum.photos/seed/tb/200',
      trackCount: 1,
    },
    {
      title: 'Magna Aliqua EP',
      year: 2020,
      type: 'EP',
      cover: 'https://picsum.photos/seed/rp/200',
      trackCount: 5,
    },
    {
      title: 'Quis Nostrud',
      year: 2019,
      type: 'Album',
      cover: 'https://picsum.photos/seed/ch/200',
      trackCount: 11,
    },
    {
      title: 'Ullamco Laboris',
      year: 2018,
      type: 'Album',
      cover: 'https://picsum.photos/seed/fl/200',
      trackCount: 9,
    },
    {
      title: 'Dolor Sit Amet 2',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Dolor Sit Amet 3',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Dolor Sit Amet 4',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Dolor Sit Amet 5',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Dolor Sit Amet 6',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
    {
      title: 'Dolor Sit Amet 7',
      year: 2024,
      type: 'Album',
      cover: 'https://picsum.photos/seed/vf/200',
      trackCount: 12,
    },
  ]);

  readonly hoveredTrack = signal<number | null>(null);
}
