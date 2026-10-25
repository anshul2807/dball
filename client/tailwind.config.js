/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dball: {
          dark: '#0A120E',
          darker: '#060B08',
          card: '#122018',
          border: '#1E382A',
          green: '#105638',
          greenLight: '#1C7E53',
          greenAccent: '#10B981',
          red: '#DC2626',
          redDark: '#B91C1C',
          redLight: '#EF4444',
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          cream: '#F9FAF7',
          surface: '#15241B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Impact', 'Teko', 'Trebuchet MS', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
