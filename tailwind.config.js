/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta usada nos gráficos e nos estados
        surface: '#0b1220',
        card: '#111c2e',
        border: '#1e2d45',
        accent: '#38bdf8',
        ok: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#7c8aa5',
      },
    },
  },
  plugins: [],
};
