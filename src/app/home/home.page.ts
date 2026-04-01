import { Component, inject, OnInit } from '@angular/core';
import { 
  IonGrid, IonRow, IonCol, IonHeader, IonListHeader, 
  IonCard, IonToolbar, IonCardHeader, IonCardTitle, 
  IonTitle, IonContent, IonLabel, IonButton 
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { MangaService } from '../services/manga-service';
import { forkJoin } from 'rxjs';

interface HomeShelf {
  title: string;
  data: any[];
  color?: string;
  type: 'local' | 'api';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ 
    IonGrid, IonRow, IonCol, IonListHeader, IonCard, IonCardHeader, 
    IonHeader, IonCardTitle, IonToolbar, IonTitle, IonContent, 
    IonLabel, IonButton, RouterLink 
  ],
})
export class HomePage implements OnInit {
  private mangaService = inject(MangaService);
  private router = inject(Router);

  homeShelves: HomeShelf[] = [];

  ngOnInit() {
    this.loadAllContent();
  }

  async loadAllContent() {
    const libraryData = await this.mangaService.getLibrary();
    const libraryArray = Object.values(libraryData || {});
  
    const favorites = libraryArray.filter((m: any) => m.isFavorite === true);
    const readingList = libraryArray.filter((m: any) => m.status === 'Reading');
  
    forkJoin({
      trending: this.mangaService.getMangaPosters('Solo Leveling'),
      topRated: this.mangaService.getMangaPosters('One Piece'),
      manhwa: this.mangaService.getManhwa()
    }).subscribe(({ trending, topRated, manhwa }) => {
      const localShelves: HomeShelf[] = [];
      
      if (favorites.length > 0) {
        localShelves.push({ 
          title: 'My Favorites', 
          data: favorites, 
          type: 'local', 
          color: '#e74c3c' 
        });
      }
      
      if (readingList.length > 0) {
        localShelves.push({ 
          title: 'Continue Reading', 
          data: readingList, 
          type: 'local', 
          color: '#2ecc71' 
        });
      }

      const apiShelves: HomeShelf[] = [
        { title: 'Trending Manhwa', data: trending, type: 'api', color: '#3498db' },
        { title: 'Top Rated Manga', data: topRated, type: 'api', color: '#f1c40f' },
        { title: 'Manhwa Selection', data: manhwa, type: 'api', color: '#9b59b6' }
      ];

      this.homeShelves = [...localShelves, ...apiShelves];
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/manga-details', id]);
  }
}