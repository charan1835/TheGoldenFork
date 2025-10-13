/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)'
      },
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
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        surface: 'rgb(var(--surface))',
        border: 'rgb(var(--border))',
        muted: 'rgb(var(--muted))',
        'muted-foreground': 'rgb(var(--muted-foreground))',
        accent: 'rgb(var(--accent))',
        'accent-foreground': 'rgb(var(--accent-foreground))',
        'primary-foreground': 'rgb(var(--primary-foreground))'
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'elevated': '0 8px 30px rgba(0,0,0,0.12)'
      },
      transitionTimingFunction: {
        'bounce-smooth': 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};
