import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this
import { FormsModule } from '@angular/forms'; // Add this
import { RouterLink } from '@angular/router';
import { MangaService } from '../services/manga-service';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonSearchbar, IonList, IonItem, IonThumbnail, 
  IonLabel, IonChip, IonSpinner 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, IonContent, IonHeader, 
    IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, 
    IonThumbnail, IonLabel, IonChip, IonSpinner
  ]
})
export class SearchPage implements OnInit {
  private mangaService = inject(MangaService);
  
  genres: string[] = [];
  results: any[] = [];
  selectedGenre: string = '';
  isLoading: boolean = false; 
  private searchTimer: any;

  ngOnInit() {
    this.mangaService.getGenres().subscribe((list: string[]) => {
      this.genres = list;
    });
  }

  handleSearch(event: any) {
    const query = event.target.value;
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      if (query && query.length > 2) {
        this.executeSearch(query);
      }
    }, 500);
  }

  executeSearch(query: string) {
    this.isLoading = true;
    this.selectedGenre = ''; 
    this.mangaService.getMangaPosters(query).subscribe((data: any[]) => {
      this.results = data;
      this.isLoading = false;
    });
  }

  searchByGenre(genre: string) {
    this.isLoading = true;
    this.selectedGenre = genre;
    this.mangaService.getMangaByGenre(genre).subscribe((data: any[]) => {
      this.results = data;
      this.isLoading = false;
    });
  }
}