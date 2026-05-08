import { Injectable, computed, effect, signal } from '@angular/core';

export interface PlayableTrack {
  id: number;
  title: string;
  preview: string;
  duration: number;
  artist: { name: string };
  album?: { cover_medium?: string; title?: string };
}

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  private readonly audioElement = new Audio();

  readonly currentTrack = signal<PlayableTrack | null>(null);
  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly volume = signal(1);
  readonly queue = signal<PlayableTrack[]>([]);

  readonly currentIndex = computed(() => {
    const track = this.currentTrack();
    if (!track) return -1;
    return this.queue().findIndex((queuedTrack) => queuedTrack.id === track.id);
  });

  readonly hasPrevious = computed(() => this.currentIndex() > 0);
  readonly hasNext = computed(() => this.currentIndex() < this.queue().length - 1);

  constructor() {
    this.audioElement.addEventListener('timeupdate', () =>
      this.currentTime.set(this.audioElement.currentTime),
    );
    this.audioElement.addEventListener('loadedmetadata', () =>
      this.duration.set(this.audioElement.duration),
    );
    this.audioElement.addEventListener('ended', () => this.next());

    effect(() => {
      const track = this.currentTrack();
      if (track) {
        document.title = `${track.title} — ${track.artist.name}`;
      } else {
        document.title = 'Deezerfy Music';
      }
    });
  }

  toggle(track: PlayableTrack, queue: PlayableTrack[] = []): void {
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

  play(track: PlayableTrack, queue: PlayableTrack[] = []): void {
    if (queue.length > 0) {
      this.queue.set(queue);
    } else if (!this.queue().find((queuedTrack) => queuedTrack.id === track.id)) {
      this.queue.update((currentQueue) => [...currentQueue, track]);
    }
    this.currentTrack.set(track);
    if (!track.preview) return;
    this.audioElement.src = track.preview;
    this.audioElement.load();
    this.audioElement
      .play()
      .then(() => this.isPlaying.set(true))
      .catch((_error: unknown) => void 0);
  }

  pause(): void {
    this.audioElement.pause();
    this.isPlaying.set(false);
  }

  resume(): void {
    this.audioElement
      .play()
      .then(() => this.isPlaying.set(true))
      .catch((_error: unknown) => void 0);
  }

  next(): void {
    const currentQueue = this.queue();
    const currentIndex = this.currentIndex();
    if (currentIndex < currentQueue.length - 1) {
      this.play(currentQueue[currentIndex + 1]);
    } else {
      this.isPlaying.set(false);
    }
  }

  previous(): void {
    const restartThresholdSeconds = 3;
    if (this.audioElement.currentTime > restartThresholdSeconds) {
      this.audioElement.currentTime = 0;
      this.currentTime.set(0);
      return;
    }
    const currentQueue = this.queue();
    const currentIndex = this.currentIndex();
    if (currentIndex > 0) {
      this.play(currentQueue[currentIndex - 1]);
    }
  }

  seek(targetTime: number): void {
    this.audioElement.currentTime = targetTime;
    this.currentTime.set(targetTime);
  }

  setVolume(volumeLevel: number): void {
    this.audioElement.volume = volumeLevel;
    this.volume.set(volumeLevel);
  }

  isCurrentTrack(trackId: number | undefined): boolean {
    if (trackId === undefined) return false;
    return this.currentTrack()?.id === trackId;
  }
}
