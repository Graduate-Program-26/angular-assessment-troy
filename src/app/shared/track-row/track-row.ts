import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlay, lucidePause, lucideListPlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { DeezerTrack } from '../../services/deezer.models';
import { Playlist } from '../../db/db';
import { FormatDurationPipe } from '../pipes/format-duration.pipe';

@Component({
  selector: 'app-track-row',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports, FormatDurationPipe],
  providers: [provideIcons({ lucidePlay, lucidePause, lucideListPlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './track-row.html',
})
export class TrackRowComponent {
  track = input.required<DeezerTrack>();
  index = input<number | null>(null);
  isActive = input<boolean>(false);
  isPlaying = input<boolean>(false);
  playlists = input<Playlist[]>([]);

  play = output<DeezerTrack>();
  addToPlaylist = output<{ track: DeezerTrack; playlistId: number }>();

  readonly hovered = signal(false);

  onPlay(): void {
    this.play.emit(this.track());
  }

  onAddToPlaylist(playlistId: number): void {
    this.addToPlaylist.emit({ track: this.track(), playlistId });
  }
}
