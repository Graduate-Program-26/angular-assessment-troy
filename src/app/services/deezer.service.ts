import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeezerAlbum, DeezerArtist, DeezerSearchResponse, DeezerTrack } from './deezer.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.deezerApiBase;

  searchTracks(
    query: string,
    limit = 25,
    index = 0,
  ): Observable<DeezerSearchResponse<DeezerTrack>> {
    const params = new HttpParams().set('q', query).set('limit', limit).set('index', index);
    return this.http.get<DeezerSearchResponse<DeezerTrack>>(`${this.baseUrl}/search/track`, {
      params,
    });
  }

  searchAlbums(
    query: string,
    limit = 25,
    index = 0,
  ): Observable<DeezerSearchResponse<DeezerAlbum>> {
    const params = new HttpParams().set('q', query).set('limit', limit).set('index', index);
    return this.http.get<DeezerSearchResponse<DeezerAlbum>>(`${this.baseUrl}/search/album`, {
      params,
    });
  }

  searchArtists(
    query: string,
    limit = 25,
    index = 0,
  ): Observable<DeezerSearchResponse<DeezerArtist>> {
    const params = new HttpParams().set('q', query).set('limit', limit).set('index', index);
    return this.http.get<DeezerSearchResponse<DeezerArtist>>(`${this.baseUrl}/search/artist`, {
      params,
    });
  }

  getAlbum(id: number): Observable<DeezerAlbum> {
    return this.http.get<DeezerAlbum>(`${this.baseUrl}/album/${id}`);
  }

  getAlbumTracks(id: number): Observable<DeezerSearchResponse<DeezerTrack>> {
    return this.http.get<DeezerSearchResponse<DeezerTrack>>(`${this.baseUrl}/album/${id}/tracks`);
  }

  getArtist(id: number): Observable<DeezerArtist> {
    return this.http.get<DeezerArtist>(`${this.baseUrl}/artist/${id}`);
  }

  getArtistAlbums(id: number): Observable<DeezerSearchResponse<DeezerAlbum>> {
    return this.http.get<DeezerSearchResponse<DeezerAlbum>>(`${this.baseUrl}/artist/${id}/albums`);
  }

  getArtistTopTracks(id: number): Observable<DeezerSearchResponse<DeezerTrack>> {
    return this.http.get<DeezerSearchResponse<DeezerTrack>>(
      `${this.baseUrl}/artist/${id}/top?limit=10`,
    );
  }
}
