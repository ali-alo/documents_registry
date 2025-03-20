import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly PREFERRED_THEME_STORAGE_KEY = 'preferred-theme';

  private readonly document = inject(DOCUMENT);
  private readonly currentTheme = signal<Theme>('light');

  constructor() {
    const theme = this.getThemeFromLocalStorage();
    this.setTheme(theme);
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.setThemeInLocalStorage(theme);
    theme === 'dark'
      ? this.document.documentElement.classList.add('dark-mode')
      : this.document.documentElement.classList.remove('dark-mode');
  }

  private setThemeInLocalStorage(theme: Theme): void {
    localStorage.setItem(this.PREFERRED_THEME_STORAGE_KEY, theme);
  }

  private getThemeFromLocalStorage(): Theme {
    return (
      (localStorage.getItem(this.PREFERRED_THEME_STORAGE_KEY) as Theme) ??
      'light'
    );
  }
}
