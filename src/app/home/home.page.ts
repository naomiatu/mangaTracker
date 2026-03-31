import { Component, inject, OnInit } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonHeader, IonListHeader, IonCard, IonToolbar, IonCardHeader, IonCardTitle, IonTitle, IonContent, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MangaService } from '../services/manga-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonGrid, IonRow, IonCol, IonListHeader, IonCard, IonCardHeader, IonHeader, IonCardTitle, IonToolbar, IonTitle, IonContent, IonLabel, CommonModule],
})
export class HomePage implements OnInit {
  private mangaService = inject(MangaService);
  private router = inject(Router);

  trendingList: any[] = [];
  topRatedList: any[] = []; 

  ngOnInit() {
    this.loadMangaData();
  }

  goToDetails(id: number) {
    this.router.navigate(['/manga-details', id]);
  }
  
  loadMangaData() {
    this.mangaService.getMangaPosters('Solo Leveling').subscribe({
      next: (data) => this.trendingList = data,
      error: (err) => console.error('Trending fetch failed', err)
    });

    this.mangaService.getMangaPosters('One Piece').subscribe({
      next: (data) => this.topRatedList = data,
      error: (err) => console.error('Top Rated fetch failed', err)
    });
  }
}