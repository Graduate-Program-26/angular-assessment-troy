import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { getDB, Playlist, Song } from '../db/db';

interface PlaylistState {
  playlists: Playlist[];
  activeSongs: Song[];
  activePlaylistId: number | null;
  loading: boolean;
}

const initialState: PlaylistState = {
  playlists: [],
  activeSongs: [],
  activePlaylistId: null,
  loading: false,
};

export const PlaylistStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ playlists, activePlaylistId, activeSongs }) => ({
    activePlaylist: computed(() => playlists().find((p) => p.id === activePlaylistId()) ?? null),
    totalDuration: computed(() => activeSongs().reduce((acc, song) => acc + song.duration, 0)),
  })),

  withMethods((store) => ({
    async loadPlaylists(): Promise<void> {
      patchState(store, { loading: true });
      const db = await getDB();
      const playlists = await db.getAll('playlists');
      patchState(store, { playlists, loading: false });
    },

    async createPlaylist(name: string): Promise<void> {
      const db = await getDB();
      await db.add('playlists', { name, createdAt: Date.now() });
      const playlists = await db.getAll('playlists');
      patchState(store, { playlists });
    },

    async deletePlaylist(id: number): Promise<void> {
      const db = await getDB();
      const tx = db.transaction(['playlists', 'songs'], 'readwrite');
      await tx.objectStore('playlists').delete(id);
      const index = tx.objectStore('songs').index('by-playlist');
      let cursor = await index.openCursor(id);
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }
      await tx.done;
      const playlists = await db.getAll('playlists');
      const wasActive = store.activePlaylistId() === id;
      patchState(store, {
        playlists,
        ...(wasActive ? { activePlaylistId: null, activeSongs: [] } : {}),
      });
    },

    async selectPlaylist(id: number): Promise<void> {
      const db = await getDB();
      const songs = await db.getAllFromIndex('songs', 'by-playlist', id);
      patchState(store, {
        activePlaylistId: id,
        activeSongs: songs.sort((a, b) => a.order - b.order),
      });
    },

    async addSong(song: Omit<Song, 'id'>): Promise<void> {
      const db = await getDB();
      await db.add('songs', song);
      if (store.activePlaylistId() === song.playlistId) {
        const songs = await db.getAllFromIndex('songs', 'by-playlist', song.playlistId);
        patchState(store, { activeSongs: songs.sort((a, b) => a.order - b.order) });
      }
    },

    async removeSong(songId: number, playlistId: number): Promise<void> {
      const db = await getDB();
      await db.delete('songs', songId);
      if (store.activePlaylistId() === playlistId) {
        const songs = await db.getAllFromIndex('songs', 'by-playlist', playlistId);
        patchState(store, { activeSongs: songs.sort((a, b) => a.order - b.order) });
      }
    },

    async reorderSongs(playlistId: number, orderedIds: number[]): Promise<void> {
      const db = await getDB();
      const tx = db.transaction('songs', 'readwrite');
      await Promise.all(
        orderedIds.map(async (id, index) => {
          const song = await tx.store.get(id);
          if (song) await tx.store.put({ ...song, order: index });
        }),
      );
      await tx.done;
      const songs = await db.getAllFromIndex('songs', 'by-playlist', playlistId);
      patchState(store, { activeSongs: songs.sort((a, b) => a.order - b.order) });
    },

    async renamePlaylist(id: number, name: string): Promise<void> {
      const db = await getDB();
      const playlist = await db.get('playlists', id);
      if (!playlist) return;
      await db.put('playlists', { ...playlist, name });
      const playlists = await db.getAll('playlists');
      patchState(store, { playlists });
    },
  })),
);
