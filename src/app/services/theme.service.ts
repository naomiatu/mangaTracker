import { Injectable, signal, inject, effect } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storage = inject(Storage);
  
  public isDarkMode = signal<boolean>(true);

  constructor() {
    effect(() => {
      this.storage.set('isDarkMode', this.isDarkMode());
      this.applyTheme(this.isDarkMode());
    });
  }

  async initTheme() {
    await this.storage.create();
    const saved = await this.storage.get('isDarkMode');
    if (saved !== null) {
      this.isDarkMode.set(saved);
    }
  }

  toggleTheme() {
    this.isDarkMode.update(val => !val);
  }

  private applyTheme(dark: boolean) {
    document.body.classList.toggle('light-theme', !dark);
  }
}