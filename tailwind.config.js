/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7ff',
          100: '#e6edff',
          200: '#c7d6ff',
          300: '#a2b8ff',
          400: '#6f8cff',
          500: '#4f6bff',
          600: '#3d52e6',
          700: '#3342be',
          800: '#2c3997',
          900: '#232d72'
        }
      }
    },
  },
  plugins: [],
};
