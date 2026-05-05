import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [],
  template: `
    @let activePlaylist = store.activePlaylist();
    @if (activePlaylist) {
      <h2>{{ activePlaylist.name }}</h2>
      <ul>
        @for (song of store.activeSongs(); track song.id) {
          <li>{{ song.title }} - {{ song.artist }}</li>
        }
      </ul>
    }
  `,
})
export class PlaylistDetail implements OnInit {
  store = inject(PlaylistStore);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadPlaylists();
    this.store.selectPlaylist(id);
  }
}
