import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { ThemeService } from './services/theme.service';
import { 
  IonApp, IonRouterOutlet, IonHeader, IonToolbar, 
  IonTitle, IonButtons, IonButton, IonIcon, IonContent, 
  IonMenu, IonMenuButton, IonList, IonItem, IonLabel, IonToggle,IonMenuToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  searchOutline, 
  settingsOutline, 
  compassOutline,
  menuOutline,
  diceOutline,
  sunnyOutline,
  moonOutline  
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonHeader, IonToolbar, 
    IonTitle, IonButtons, IonButton, IonIcon, RouterLink, RouterLinkActive,
    IonContent, IonMenu, IonMenuButton, IonList, IonItem, IonLabel, IonToggle,IonMenuToggle
  ],
})
export class AppComponent implements OnInit {
  public themeService = inject(ThemeService);

  constructor() {
    addIcons({ 
      homeOutline, 
      searchOutline, 
      settingsOutline, 
      compassOutline, 
      menuOutline,
      diceOutline,
      sunnyOutline,
      moonOutline
    });
  }

  async ngOnInit() {
    await this.themeService.initTheme();
  }
}