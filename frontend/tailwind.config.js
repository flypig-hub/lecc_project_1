/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
      },
      colors: {
        'rpg-gold': '#FFD700',
        'rpg-dark': '#0a0a0a',
        'rpg-darker': '#000000',
        'rpg-light': '#1a1a1a',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700' },
          '100%': { textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
