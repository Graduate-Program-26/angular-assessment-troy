import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistStore } from '../../store/playlist.store';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSeparator } from '@spartan-ng/helm/separator';
@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [HlmCardImports, HlmSeparator, HlmBadgeImports],
  templateUrl: `playlist-detail.html`,
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
