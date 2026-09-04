import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDarkSubject.asObservable();
  isDarkMode$ = this.isDark$;

  constructor() {
    const saved = localStorage.getItem('fiq_theme');
    if (saved) {
      this.setDark(saved === 'dark');
    } else {
      this.setDark(true); // Default dark industrial theme
    }
  }

  toggleTheme() {
    this.setDark(!this.isDarkSubject.value);
  }

  private setDark(isDark: boolean) {
    this.isDarkSubject.next(isDark);
    localStorage.setItem('fiq_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}
