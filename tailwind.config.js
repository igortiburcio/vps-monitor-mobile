/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  /**
   * 'class' em vez do padrão 'media': o runtime web do NativeWind observa o
   * <head>, lê `--css-interop-darkMode` e chama Appearance.setColorScheme().
   * Com 'media' esse caminho lança erro no react-native-web.
   */
  darkMode: 'class',
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
