import { useMemo } from 'preact/hooks';
import { Link } from './link.component';
import { MdWbSunny, MdDarkMode, MdMenu, MdClose } from 'react-icons/md';
import logoBlack from '../assets/logo-name-black.jpg';
import logoWhite from '../assets/logo-name-whte.jpg';
import { MenuViewModel } from './viewModels/menu.viewModel';
import { Menu } from './menu.component';

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export function Header({ toggleTheme, currentTheme }: HeaderProps) {
  const menuViewModel = useMemo(() => new MenuViewModel(), []);
  const isMenuOpen = menuViewModel.isMenuOpen.value;

  return (
    <header
      className="w-full p-4 flex justify-between items-center relative"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="flex items-center">
        <Link href="/" className="block">
          <img
            src={currentTheme === 'light' ? logoWhite : logoBlack}
            alt="Staretz"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-4">
          <Link
            href="/blog"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Blog
          </Link>
          <Link
            href="/blog/topics"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Temes
          </Link>
          <Link
            href="/blog/tags"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Etiquetes
          </Link>
          <Link
            href="/about"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Info
          </Link>
        </nav>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full cursor-pointer hover:bg-black/10 transition-colors"
          aria-label="Toggle theme"
          style={{ color: 'var(--primary-color)' }}
        >
          {currentTheme === 'light' ? <MdDarkMode size={24} /> : <MdWbSunny size={24} />}
        </button>

        <button
          onClick={menuViewModel.toggleMenu}
          className="md:hidden p-2 rounded-full cursor-pointer hover:bg-black/10 transition-colors"
          aria-label="Toggle menu"
          style={{ color: 'var(--primary-color)' }}
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        <Menu viewModel={menuViewModel} />
      </div>
    </header>
  );
}
