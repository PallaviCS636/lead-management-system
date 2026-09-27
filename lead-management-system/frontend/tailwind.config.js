/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#c9bdff',
          300: '#a892ff',
          400: '#8a63ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1470',
        },
        accent: {
          teal: '#14b8a6',
          coral: '#fb7185',
          amber: '#f59e0b',
          sky: '#38bdf8',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(124, 58, 237, 0.25)',
        pop: '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [],
};
