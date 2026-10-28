/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#02060E', // Deep Navy / Black specified by user
          900: '#070D19',
          850: '#0B1324',
          800: '#0F1A30',
          700: '#1A294A',
          600: '#253A65',
        },
        royal: {
          DEFAULT: '#9303C5', // Specified by user
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9303C5', // Primary Royal Violet
          700: '#7E02A9',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'violet-glow': '0 0 25px -5px rgba(147, 3, 197, 0.4)',
        'violet-glow-lg': '0 0 45px -8px rgba(147, 3, 197, 0.55)',
        'violet-subtle': '0 4px 20px -2px rgba(147, 3, 197, 0.25)',
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg, #9303C5 0%, #6B21A8 100%)',
        'subtle-violet': 'linear-gradient(180deg, rgba(147, 3, 197, 0.08) 0%, rgba(2, 6, 14, 0) 100%)',
        'glass-surface': 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}

