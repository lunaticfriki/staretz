import { signal, effect, type Signal } from '@preact/signals';

export type Theme = 'light' | 'dark';

export class ThemeViewModel {
  currentTheme: Signal<Theme>;

  constructor() {
    this.currentTheme = signal(this.getInitialTheme());

    effect(() => {
      this.persistTheme(this.currentTheme.value);
    });
  }

  private getInitialTheme(): Theme {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as Theme;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  private persistTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  toggle = (): void => {
    this.currentTheme.value = this.currentTheme.value === 'light' ? 'dark' : 'light';
  };
}
