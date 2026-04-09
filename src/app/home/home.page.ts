import { Component, inject, OnInit } from '@angular/core';
import { 
  IonGrid, IonRow, IonCol, IonHeader, IonListHeader, 
  IonCard, IonToolbar, IonCardHeader, IonCardTitle, 
  IonTitle, IonContent, IonLabel, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';
import { heart, heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
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
    IonLabel, IonButton, IonIcon ,RouterLink 
  ],
})
export class HomePage implements OnInit {
  private mangaService = inject(MangaService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private favIds: Set<number> = new Set();

  homeShelves: HomeShelf[] = [];

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.loadAllContent();
  }
  ionViewWillEnter() {
    this.loadAllContent();
  }
  isMangaFavorite(id: number): boolean {
    return this.favIds.has(id);
  }

  async loadAllContent() {
    const libraryData = await this.mangaService.getLibrary();
    this.favIds = new Set(
      Object.values(libraryData)
        .filter((m: any) => m.isFavorite)
        .map((m: any) => m.mangaId)
    );

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

  async toggleQuickFav(event: Event, manga: any) {
    event.stopPropagation();
    const id = manga.id || manga.mangaId;
    const library = await this.mangaService.getLibrary() || {};
    let message = '';

    if (this.favIds.has(id)) {
      this.favIds.delete(id);
      if (library[id]) library[id].isFavorite = false;
      message = 'Removed from favorites';
    } else {
      this.favIds.add(id);
      library[id] = {
        mangaId: id,
        title: manga.title?.romaji || manga.title,
        image: manga.coverImage?.large || manga.image,
        isFavorite: true,
        status: library[id]?.status || 'Want to Read'
      };
      message = 'Added to favorites';
    }

    await this.mangaService.saveToLibrary(library);
    this.showToast(message);
    this.loadAllContent(); 
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  goToDetails(id: number) {
    this.router.navigate(['/manga-details', id]);
  }
}