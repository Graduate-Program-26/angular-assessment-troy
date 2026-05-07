import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';

  readonly isDark = signal(false);

  constructor() {
    const stored = localStorage.getItem(this.storageKey);
    const prefersDark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark);
  }

  toggle(): void {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
  }
}
