import { Component, computed, signal } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

interface SearchResult {
  title: string;
  description: string;
}

interface SearchResults {
  artists: SearchResult[];
  albums: SearchResult[];
  songs: SearchResult[];
}

@Component({
  selector: 'app-search',
  imports: [NgIcon, HlmInputImports, HlmCardImports, HlmSpinnerImports, HlmTabsImports],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  loading = signal(false);
  results = signal<SearchResults>({ artists: [], albums: [], songs: [] });

  hasResults = computed(() => {
    const r = this.results();
    return r.artists.length > 0 || r.albums.length > 0 || r.songs.length > 0;
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.results.set({ artists: [], albums: [], songs: [] });

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (!value.trim()) return;

    this.loading.set(true);

    this.debounceTimer = setTimeout(() => {
      this.results.set({
        artists: Array.from({ length: 5 }, (_, i) => ({
          title: `Artist ${i + 1} for "${value}"`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        })),
        albums: Array.from({ length: 5 }, (_, i) => ({
          title: `Album ${i + 1} for "${value}"`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        })),
        songs: Array.from({ length: 5 }, (_, i) => ({
          title: `Song ${i + 1} for "${value}"`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        })),
      });
      this.loading.set(false);
    }, 800);
  }
}
