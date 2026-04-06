import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MangaService } from '../../services/manga-service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol]
})
export class CategoryListPage implements OnInit {
  private route = inject(ActivatedRoute);
  private mangaService = inject(MangaService);

  categoryTitle: string = '';
  mangaList: any[] = [];

  ngOnInit() {
    this.categoryTitle = this.route.snapshot.paramMap.get('type') || '';
    this.loadCategoryData();
  }

  loadCategoryData() {
    if (this.categoryTitle === 'Trending Manhwa' || this.categoryTitle === 'Manhwa Selection') {
      this.mangaService.getManhwa().subscribe(data => this.mangaList = data);
      
    } else if (this.categoryTitle === 'Top Rated Manga') {
      this.mangaService.getMangaPosters('One Piece').subscribe(data => this.mangaList = data);
      
    } else {
      this.mangaService.getLibrary().then(data => {
        const arr = Object.values(data || {});
        if (this.categoryTitle === 'My Favorites') {
          this.mangaList = arr.filter((m: any) => m.isFavorite);
        } else if (this.categoryTitle === 'Continue Reading') {
          this.mangaList = arr.filter((m: any) => m.status === 'Reading');
        }
      });
    }
  }
}