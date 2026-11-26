/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#F7F5EE',
          200: '#EDE9DE',
          300: '#DFD8C8',
          400: '#C7BC9F',
        },
        charcoal: {
          900: '#131619',
          800: '#1D2226',
          700: '#2A3036',
          600: '#404952',
          500: '#5B6673',
          400: '#8592A0',
          300: '#BAC2CB',
          200: '#E2E5E9',
          100: '#F1F3F5',
        },
        brand: {
          50: '#FFF4EE',
          100: '#FFE6D9',
          200: '#FFCEB5',
          300: '#FFAF85',
          400: '#FF8447',
          500: '#FF5722', // Primary BreakBite saffron/orange
          600: '#E64A19',
          700: '#D84315',
          800: '#BF360C',
          900: '#872507',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.09), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
