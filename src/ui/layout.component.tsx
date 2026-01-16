import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { Header } from './header.component';
import { Footer } from './footer.component';
import { ThemeViewModel } from './viewModels/theme.viewModel';
import logoFaceBlack from '../assets/logo-face-black.jpg';
import logoFaceWhite from '../assets/logo-face-white.jpg';

import { Toast } from './toast.component';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  const viewModel = useMemo(() => new ThemeViewModel(), []);
  const currentTheme = viewModel.currentTheme.value;

  return (
    <div
      className="flex flex-col min-h-screen w-full relative"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <img
        src={currentTheme === 'light' ? logoFaceWhite : logoFaceBlack}
        alt=""
        className="fixed top-0 left-0 w-full h-full z-0 object-cover object-center pointer-events-none opacity-[0.05]"
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Header toggleTheme={viewModel.toggle} currentTheme={currentTheme} />
        <main className="grow p-4 w-full max-w-7xl mx-auto mt-4 mb-4">{children}</main>
        <Footer currentTheme={currentTheme} />
      </div>
      <Toast />
    </div>
  );
}
