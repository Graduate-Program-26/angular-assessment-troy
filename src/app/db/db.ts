import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Song {
  id?: number;
  playlistId: number;
  title: string;
  artist: string;
  duration: number;
  order: number;
  preview?: string;
}

export interface Playlist {
  id?: number;
  name: string;
  createdAt: number;
}

interface PlaylistDB extends DBSchema {
  playlists: {
    key: number;
    value: Playlist;
  };
  songs: {
    key: number;
    value: Song;
    indexes: { 'by-playlist': number };
  };
}

let dbInstance: IDBPDatabase<PlaylistDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PlaylistDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<PlaylistDB>('playlist-db', 1, {
    upgrade(db) {
      db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
      const songStore = db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      songStore.createIndex('by-playlist', 'playlistId');
    },
  });
  return dbInstance;
}
