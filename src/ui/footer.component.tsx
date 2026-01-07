export function Footer() {
  return (
    <footer
      className="w-full p-4 text-center mt-auto"
      style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--text-color)' }}
    >
      <p>&copy; {new Date().getFullYear()} staretz. All rights reserved.</p>
    </footer>
  );
}
