import { useRef, useEffect } from 'preact/hooks';
import { Link } from './link.component';
import { MenuViewModel } from './viewModels/menu.viewModel';

interface MenuProps {
  viewModel: MenuViewModel;
}

export function Menu({ viewModel }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isOpen = viewModel.isMenuOpen.value;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        viewModel.closeMenu();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, viewModel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="absolute top-16 right-4 z-50 p-4 rounded-lg shadow-lg md:hidden flex flex-col gap-4 min-w-[200px]"
      style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--primary-color)' }}
    >
      <nav className="flex flex-col gap-4">
        <Link
          href="/blog"
          className="hover:text-(--primary-color)"
          activeClassName="font-bold underline text-(--primary-color)"
          onClick={() => viewModel.closeMenu()}
        >
          Blog
        </Link>
        <Link
          href="/blog/topics"
          className="hover:text-(--primary-color)"
          activeClassName="font-bold underline text-(--primary-color)"
          onClick={() => viewModel.closeMenu()}
        >
          Temes
        </Link>
        <Link
          href="/blog/tags"
          className="hover:text-(--primary-color)"
          activeClassName="font-bold underline text-(--primary-color)"
          onClick={() => viewModel.closeMenu()}
        >
          Etiquetes
        </Link>
        <Link
          href="/about"
          className="hover:text-(--primary-color)"
          activeClassName="font-bold underline text-(--primary-color)"
          onClick={() => viewModel.closeMenu()}
        >
          Info
        </Link>
      </nav>
    </div>
  );
}
