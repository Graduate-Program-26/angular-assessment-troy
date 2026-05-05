import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [],
  template: `
    <input #nameInput type="text" placeholder="Playlist name" />
    <button (click)="create(nameInput)">Create</button>

    <ul>
      @for (playlist of store.playlists(); track playlist.id) {
        <li
          role="button"
          tabindex="0"
          (click)="navigate(playlist.id!)"
          (keydown.enter)="navigate(playlist.id!)"
          (keydown.space)="navigate(playlist.id!)"
        >
          {{ playlist.name }}
        </li>
      }
    </ul>
  `,
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
