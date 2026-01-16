import logoBlack from '../assets/logo-face-black.jpg';
import logoWhite from '../assets/logo-face-white.jpg';

interface FooterProps {
  currentTheme: 'light' | 'dark';
}

export function Footer({ currentTheme }: FooterProps) {
  return (
    <footer
      className="w-full p-4 flex justify-between items-center mt-auto"
      style={{ backgroundColor: 'transparent', color: 'var(--text-color)' }}
    >
      <p>
        &copy; <span>{new Date().getFullYear()}</span> staretz. All rights reserved.
      </p>
      <div>
        <img
          src={currentTheme === 'light' ? logoWhite : logoBlack}
          alt="Staretz Logo"
          className="h-15 w-auto object-contain"
        />
      </div>
    </footer>
  );
}
