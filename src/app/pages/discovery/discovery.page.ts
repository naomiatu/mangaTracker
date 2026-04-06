import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, 
  IonCol, IonChip, IonLabel, IonList, IonItem, IonThumbnail, IonBadge,
  IonButton, IonIcon, IonListHeader,IonSpinner
} from '@ionic/angular/standalone';
import { MangaService } from '../../services/manga-service';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.page.html',
  styleUrls: ['./discovery.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, 
    IonCol, IonChip, IonLabel, IonList, IonItem, IonThumbnail, IonBadge,
    IonButton, IonIcon, IonListHeader,IonSpinner
  ]
})
export class DiscoveryPage {
  private mangaService = inject(MangaService);

  genres: string[] = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Sports', 'Supernatural', 'Thriller'];
  
  selectedGenres: string[] = [];
  results: any[] = [];
  isLoading: boolean = false;

  toggleGenre(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else if (this.selectedGenres.length < 3) {
      this.selectedGenres.push(genre);
    }

    if (this.selectedGenres.length === 3) {
      this.searchDiscovery();
    } else {
      this.results = [];
    }
  }

  searchDiscovery() {
    if (this.selectedGenres.length === 0) return;
  
    this.isLoading = true;
    
    this.mangaService.getMangaByMultipleGenres(this.selectedGenres).subscribe({
      next: (data) => {
        this.results = data.sort((a, b) => b.averageScore - a.averageScore);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Discovery Error:', err);
        this.isLoading = false;
      }
    });
  }

  async rollDiscovery() {
    this.isLoading = true;
    this.results = [];
    
    for (let i = 0; i < 10; i++) {
      this.selectedGenres = [...this.genres]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      await new Promise(resolve => setTimeout(resolve, 80)); 
    }
  
    this.searchDiscovery();
  }

clearAll() {
  this.selectedGenres = [];
  this.results = [];
  this.isLoading = false;
}
}