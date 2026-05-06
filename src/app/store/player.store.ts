import { Injectable, computed, signal } from '@angular/core';
import { DeezerTrack } from '../services/deezer.models';

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  private readonly audio = new Audio();

  readonly currentTrack = signal<DeezerTrack | null>(null);
  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly volume = signal(1);
  readonly queue = signal<DeezerTrack[]>([]);

  readonly currentIndex = computed(() => {
    const track = this.currentTrack();
    if (!track) return -1;
    return this.queue().findIndex((t) => t.id === track.id);
  });

  readonly hasPrevious = computed(() => this.currentIndex() > 0);
  readonly hasNext = computed(() => this.currentIndex() < this.queue().length - 1);

  constructor() {
    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('loadedmetadata', () => this.duration.set(this.audio.duration));
    this.audio.addEventListener('ended', () => this.next());
  }

  toggle(track: DeezerTrack, queue: DeezerTrack[] = []): void {
    if (this.currentTrack()?.id === track.id) {
      if (this.isPlaying()) {
        this.pause();
      } else {
        this.resume();
      }
    } else {
      this.play(track, queue);
    }
  }

  play(track: DeezerTrack, queue: DeezerTrack[] = []): void {
    if (queue.length > 0) {
      this.queue.set(queue);
    } else if (!this.queue().find((t) => t.id === track.id)) {
      this.queue.update((q) => [...q, track]);
    }
    this.currentTrack.set(track);
    if (!track.preview) return;
    this.audio.src = track.preview;
    this.audio.load();
    this.audio
      .play()
      .then(() => this.isPlaying.set(true))
      .catch((_err: unknown) => void 0);
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  resume(): void {
    this.audio
      .play()
      .then(() => this.isPlaying.set(true))
      .catch((_err: unknown) => void 0);
  }

  next(): void {
    const q = this.queue();
    const idx = this.currentIndex();
    if (idx < q.length - 1) {
      this.play(q[idx + 1]);
    } else {
      this.isPlaying.set(false);
    }
  }

  previous(): void {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      this.currentTime.set(0);
      return;
    }
    const q = this.queue();
    const idx = this.currentIndex();
    if (idx > 0) {
      this.play(q[idx - 1]);
    }
  }

  seek(time: number): void {
    this.audio.currentTime = time;
    this.currentTime.set(time);
  }

  setVolume(vol: number): void {
    this.audio.volume = vol;
    this.volume.set(vol);
  }

  isCurrentTrack(id: number | undefined): boolean {
    if (id === undefined) return false;
    return this.currentTrack()?.id === id;
  }
}
