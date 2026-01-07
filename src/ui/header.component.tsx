import { Link as RouterLink } from 'preact-router/match';
import type { FunctionalComponent, JSX } from 'preact';

const Link = RouterLink as unknown as FunctionalComponent<
  JSX.IntrinsicElements['a'] & { activeClassName?: string }
>;
import { MdWbSunny, MdDarkMode } from 'react-icons/md';

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
        <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
          staretz
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex gap-4">
          <Link
            href="/about"
            activeClassName="font-bold underline"
            className="hover:text-(--secondary-color)"
          >
            About
          </Link>
          <Link
            href="/programming"
            activeClassName="font-bold underline"
            className="hover:text-(--secondary-color)"
          >
            Programming
          </Link>
          <Link
            href="/blog"
            activeClassName="font-bold underline"
            className="hover:text-(--secondary-color)"
          >
            Blog
          </Link>
          <Link
            href="/music"
            activeClassName="font-bold underline"
            className="hover:text-(--secondary-color)"
          >
            Music
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
