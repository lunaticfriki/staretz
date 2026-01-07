import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { Header } from './header.component';
import { Footer } from './footer.component';
import { ThemeViewModel } from './viewModels/theme.viewModel';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  const viewModel = useMemo(() => new ThemeViewModel(), []);

  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <Header toggleTheme={viewModel.toggle} currentTheme={viewModel.currentTheme.value} />
      <main className="grow p-4 w-full max-w-7xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
