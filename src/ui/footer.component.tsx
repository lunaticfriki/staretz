export function Footer() {
  return (
    <footer
      className="w-full p-4 text-center mt-auto"
      style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--text-color)' }}
    >
      <p>
        &copy; <span>{new Date().getFullYear()}</span> staretz. All rights reserved.
      </p>
    </footer>
  );
}
