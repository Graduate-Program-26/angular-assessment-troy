import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePlay,
  lucidePause,
  lucideSkipBack,
  lucideSkipForward,
  lucideVolume2,
  lucideVolumeX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { PlayerStore } from '../../store/player.store';
import { FormatDurationPipe } from '../../shared/pipes/format-duration.pipe';

@Component({
  selector: 'app-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButtonImports, FormatDurationPipe],
  providers: [
    provideIcons({
      lucidePlay,
      lucidePause,
      lucideSkipBack,
      lucideSkipForward,
      lucideVolume2,
      lucideVolumeX,
    }),
  ],
  templateUrl: './player.html',
})
export class Player {
  readonly store = inject(PlayerStore);

  onSeek(event: Event): void {
    this.store.seek(+(event.target as HTMLInputElement).value);
  }

  onVolumeChange(event: Event): void {
    this.store.setVolume(+(event.target as HTMLInputElement).value);
  }
}
