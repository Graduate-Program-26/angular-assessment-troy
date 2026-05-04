import { Component, signal } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-search',
  imports: [NgIcon, HlmInputImports, HlmCardImports, HlmSpinnerImports],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  loading = signal(false);
  //havent decided if this will be album only or artist only search. May decide to
  //do as spotify with unified search, showing artist first. This is placeholder type for now.
  results = signal<{ title: string; description: string }[]>([]);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.results.set([]);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (!value.trim()) return;

    this.loading.set(true);

    //gonna make my api call here

    this.debounceTimer = setTimeout(() => {
      this.results.set(
        Array.from({ length: 5 }, (_, i) => ({
          title: `Result ${i + 1} for "${value}"`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        })),
      );
      this.loading.set(false);
    }, 800);
  }
}
