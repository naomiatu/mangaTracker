import { Component, inject, OnInit } from '@angular/core';
import { IonGrid, IonRow, IonButton, IonCol, IonHeader, IonListHeader, IonCard, IonToolbar, IonCardHeader, IonSearchbar, IonCardTitle, IonCardSubtitle, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common'; // Required for lists
import { MangaService } from '../services/manga-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonButton, IonCol, IonListHeader, IonCard, IonCardSubtitle, IonCardHeader, IonHeader, IonSearchbar ,IonCardTitle, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel, CommonModule],
})

export class HomePage implements OnInit {
  private mangaService = inject(MangaService);
  mangaList: any[] = [];
  trendingList: any[] = [];

  ngOnInit() {
    this.loadDefaultManga();
  }

  loadDefaultManga() {
    this.mangaService.getMangaPosters('Solo Leveling').subscribe({
      next: (data) => this.mangaList = data,
      error: (err) => console.error('Search failed', err)
    });
  }
}

