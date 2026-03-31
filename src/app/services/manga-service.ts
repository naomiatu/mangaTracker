import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private http = inject(HttpClient);
  private readonly url = 'https://graphql.anilist.co';

  getMangaPosters(searchTerm: string): Observable<any> {
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

    return this.http.post(this.url, {
      query: query,
      variables: { search: searchTerm }
    }).pipe(
      map((response: any) => response.data.Page.media)
    );
  }
}