/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/host/src/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff00ff', // Magenta
        background: '#000000', // Black
        text: '#d1d5db', // Light gray
      },
    },
  },
  plugins: [],
};
