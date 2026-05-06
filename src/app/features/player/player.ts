import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-player',
  imports: [NgIcon, HlmButtonImports],
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

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onSeek(event: Event): void {
    this.store.seek(+(event.target as HTMLInputElement).value);
  }
}
