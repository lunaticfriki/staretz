import { Link } from './link.component';
import { MdWbSunny, MdDarkMode } from 'react-icons/md';
import logoBlack from '../assets/logo-name-black.jpg';
import logoWhite from '../assets/logo-name-whte.jpg';

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export function Header({ toggleTheme, currentTheme }: HeaderProps) {
  return (
    <header
      className="w-full p-4 flex justify-between items-center"
      style={{ backgroundColor: 'var(--header-bg)' }}
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
        <nav className="flex gap-4">
          <Link
            href="/blog"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Blog
          </Link>
          <Link
            href="/programming"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Programming
          </Link>
          <Link
            href="/music"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            Music
          </Link>
          <Link
            href="/about"
            activeClassName="font-bold underline text-(--primary-color)"
            className="hover:text-(--primary-color)"
          >
            About
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
      </div>
    </header>
  );
}
