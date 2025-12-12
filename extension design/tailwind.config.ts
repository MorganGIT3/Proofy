import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#ff8c5a',
          500: '#ff6b35',
          600: '#e55a2b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
