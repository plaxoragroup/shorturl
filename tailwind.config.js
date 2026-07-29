/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          purple: '#8B5CF6',
          'purple-hover': '#7C3AED',
          cyan: '#06B6D4',
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
        },
        surface: {
          white: '#FFFFFF',
          offwhite: '#F8FAFC',
          lightgray: '#F1F5F9',
          border: '#E2E8F0',
          mediumgray: '#64748B',
          darkgray: '#334155',
          nearblack: '#0F172A',
          darkbg: '#090D16',
          darkcard: '#131B2E',
          darkborder: '#1E293B',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
      }
    }
  },
  plugins: [],
}
