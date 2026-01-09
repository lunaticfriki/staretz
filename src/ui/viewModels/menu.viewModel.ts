import { signal, type Signal } from '@preact/signals';

export class MenuViewModel {
  isMenuOpen: Signal<boolean>;

  constructor() {
    this.isMenuOpen = signal(false);
  }

  toggleMenu = (): void => {
    this.isMenuOpen.value = !this.isMenuOpen.value;
  };

  closeMenu = (): void => {
    this.isMenuOpen.value = false;
  };
}
