import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private http = inject(HttpClient);
  private readonly url = 'https://graphql.anilist.co';

  getMangaPosters(searchTerm: string): Observable<any> {
    const cacheKey = `cache_${searchTerm.replace(/\s+/g, '_').toLowerCase()}`;
    
    const savedData = localStorage.getItem(cacheKey);

    if (savedData) {
      console.log(`📦 Loading "${searchTerm}" from LocalStorage cache.`);
      return of(JSON.parse(savedData)); 
    }

    const query = `
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: MANGA) {
            id
            title { english romaji }
            coverImage { large }
            format
          }
        }
      }
    `;

    console.log(`🌐 Fetching "${searchTerm}" from AniList API...`);
    return this.http.post(this.url, {
      query: query,
      variables: { search: searchTerm }
    }).pipe(
      map((response: any) => response.data.Page.media),
      tap((mediaList) => {
        localStorage.setItem(cacheKey, JSON.stringify(mediaList));
      })
    );
  }
}