import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private http = inject(HttpClient);
  private storage = inject(Storage);
  private readonly url = 'https://graphql.anilist.co';
  private storageReady: Promise<void>;


  constructor() {
    this.storageReady = this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
    }

  async getLibrary() {
    await this.storageReady;
    const data = await this.storage.get('my_manga_library');
    return data || {}; 
    }

  async saveToLibrary(library: any) {
    await this.storageReady;
    return await this.storage.set('my_manga_library', library);
  }

  getGenres(): Observable<string[]> {
    const query = `query { GenreCollection }`;
    return this.http.post(this.url, { query }).pipe(
      map((res: any) => res.data.GenreCollection)
    );
  }

  getMangaByGenre(genre: string): Observable<any[]> {
    const query = `
      query ($genre: String) {
        Page(perPage: 20) {
          media(genre: $genre, type: MANGA, isAdult: false, sort: POPULARITY_DESC) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
            status
            chapters
          }
        }
      }
    `;
    return this.http.post(this.url, { query, variables: { genre } }).pipe(
      map((res: any) => res.data.Page.media)
    );
  }

  getManhwa(): Observable<any[]> {
    const query = `
      query {
        Page(perPage: 15) {
          media(type: MANGA, countryOfOrigin: "KR", sort: POPULARITY_DESC, isAdult: false) {
            id
            title { romaji english }
            coverImage { large }
            chapters
            status
            averageScore
          }
        }
      }
    `;
    return this.http.post(this.url, { query }).pipe(
      map((res: any) => res.data.Page.media)
    );
  }

  getMangaById(id: number): Observable<any> {
    const query = `
      query ($id: Int) {
        Media (id: $id, type: MANGA) {
          id
          title { romaji english }
          coverImage { large }
          description
          format
          chapters
          status
          averageScore
          genres
        }
      }
    `;
    return this.http.post(this.url, { query, variables: { id } }).pipe(
      map((res: any) => res.data.Media)
    );
  }

  getMangaPosters(searchTerm: string): Observable<any> {
    const query = `
      query ($search: String) {
        Page (perPage: 15) {
          media (search: $search, type: MANGA, isAdult: false) {
            id
            title { romaji english }
            coverImage { large }
            format 
            chapters
            status    
            averageScore 
          }
        }
      }
    `;
    return this.http.post(this.url, { query, variables: { search: searchTerm } }).pipe(
      map((res: any) => res.data.Page.media)
    );
  }
  getMangaByMultipleGenres(genres: string[]): Observable<any[]> {
    const query = `
      query ($genres: [String]) {
        Page(perPage: 20) {
          media(genre_in: $genres, type: MANGA, isAdult: false, sort: SCORE_DESC) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
            status
            chapters
            genres
          }
        }
      }
    `;
    return this.http.post(this.url, { query, variables: { genres } }).pipe(
      map((res: any) => {
        const results = res.data.Page.media;
        return results.filter((manga: any) => 
          genres.every(genre => manga.genres.includes(genre))
        );
      })
    );
  }
}