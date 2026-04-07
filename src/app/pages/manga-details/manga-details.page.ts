import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonButtons, IonCard, IonBackButton, IonSelect, IonSelectOption, IonList, IonItem, IonBadge, IonButton, IonTitle, IonToolbar, IonSpinner, IonRange, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, star, chevronDownOutline, add, remove, refreshOutline } from 'ionicons/icons';
import { MangaService } from '../../services/manga-service';

@Component({
  selector: 'app-manga-details',
  templateUrl: './manga-details.page.html',
  styleUrls: ['./manga-details.page.scss'],
  standalone: true,
  imports: [ 
    CommonModule, FormsModule, IonContent, IonSelect, IonSelectOption, 
    IonList, IonItem, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonBadge, IonButton, IonCard, IonSpinner, IonRange, IonIcon 
  ]
})
export class MangaDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private mangaService = inject(MangaService);

  manga: any = null;
  userProgress: any = {
    status: 'Want to Read',
    currentChapter: 0,
    myRating: 0,
    isFavorite: false
  };

  constructor() {
    addIcons({ heart, heartOutline, star, chevronDownOutline, add, remove, refreshOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadMangaDetails(id);
    this.loadUserProgress(id); 
  }

  async loadUserProgress(id: string | null) {
    if (!id) return;
    const library = await this.mangaService.getLibrary() || {};
    if (library[id]) {
      this.userProgress = library[id];
    }
  }

  toggleFav() {
    this.userProgress.isFavorite = !this.userProgress.isFavorite;
    this.saveToLibrary();
  }

  async saveToLibrary() {
    if (!this.manga) return;
    const library = await this.mangaService.getLibrary() || {};
    
    library[this.manga.id] = {
      ...this.userProgress, 
      mangaId: this.manga.id,
      title: this.manga.title?.romaji || this.manga.title?.english || this.manga.title,      image: this.manga.coverImage?.large || this.manga.image,
      chapters: this.manga.chapters,
      lastUpdated: new Date().toISOString()
    };
  
    await this.mangaService.saveToLibrary(library);
  }

  updateChapter(change: number) {
    this.userProgress.currentChapter += change;
    if (this.userProgress.currentChapter < 0) this.userProgress.currentChapter = 0;
    this.saveToLibrary();
  }

  async refreshCache() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.mangaService.getMangaById(+id).subscribe(async (res) => {
      this.manga = res;
      const library = await this.mangaService.getLibrary() || {};
      
      library[res.id] = {
        ...this.userProgress,
        mangaId: res.id,
        title: res.title?.romaji || res.title?.english || res.title,
        image: res.coverImage?.large || res.image,
        status: res.status,
        chapters: res.chapters,
        lastUpdated: new Date().toISOString()
      };
      
      await this.mangaService.saveToLibrary(library);
    });
  }

  loadMangaDetails(idString: string | null) {
    if (!idString) return;
    const id = parseInt(idString);
    
    this.mangaService.getMangaById(id).subscribe(res => {
      this.manga = res;
    });
  }
}