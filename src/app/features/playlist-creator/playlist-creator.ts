import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideListMusic } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [HlmButtonImports, HlmInputImports, HlmSeparatorImports, NgIcon],
  providers: [provideIcons({ lucideChevronRight, lucideListMusic })],
  templateUrl: './playlist-creator.html',
})
export class PlaylistsComponent implements OnInit {
  store = inject(PlaylistStore);
  router = inject(Router);

  ngOnInit(): void {
    this.store.loadPlaylists();
  }

  create(input: HTMLInputElement): void {
    const name = input.value.trim();
    if (!name) return;
    this.store.createPlaylist(name);
    input.value = '';
  }

  navigate(id: number): void {
    this.router.navigate(['/playlist', id]);
  }
}
