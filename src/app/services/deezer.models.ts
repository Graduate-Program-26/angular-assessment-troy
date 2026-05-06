export interface DeezerArtist {
  id: number;
  name: string;
  picture: string;
  picture_medium: string;
  picture_xl?: string;
  nb_album: number;
  nb_fan: number;
  link: string;
  radio?: boolean;
  tracklist?: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_medium: string;
  cover_xl?: string;
  release_date: string;
  nb_tracks: number;
  artist: DeezerArtist;
  link: string;
  label?: string;
  duration?: number;
  fans?: number;
  record_type?: string;
  genres?: { data: { id: number; name: string }[] };
}

export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string;
  rank: number;
  artist: DeezerArtist;
  album: DeezerAlbum;
  link: string;
  track_position?: number;
  explicit_lyrics?: boolean;
}

export interface DeezerSearchResponse<T> {
  data: T[];
  total: number;
  next?: string;
}
