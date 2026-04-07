import { Component, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonIcon, IonListHeader, AlertController, IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, refreshOutline, informationCircleOutline, hourglassOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonButton
  ]
})
export class SettingsPage {
  private alertCtrl = inject(AlertController); 
  private storage = inject(Storage);

  constructor() {
    addIcons({ trashOutline, refreshOutline, informationCircleOutline, hourglassOutline });
  }

  async confirmReset(type: 'cache' | 'library') {
    const isCache = type === 'cache';
    
    const alert = await this.alertCtrl.create({
      header: isCache ? 'Clear Cache?' : 'Reset Library?',
      message: isCache 
        ? 'This will refresh search data but keep your saved manga.' 
        : 'Warning: This will permanently delete your favorites and reading list!',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Confirm', 
          role: 'destructive',
          handler: () => isCache ? this.clearCache() : this.clearAllData() 
        }
      ]
    });

    await alert.present();
  }

  private async clearAllData() {
    await this.storage.clear(); 
    await Haptics.impact({ style: ImpactStyle.Heavy });
    
    window.location.reload();
  }
  private async clearCache() {
    await this.storage.remove('my_manga_library'); 
    await Haptics.impact({ style: ImpactStyle.Light });
    window.location.reload();
  }
}