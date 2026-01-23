/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#1C2E36', // Deep Slate
          100: '#E1E9EA', // Arctic Mist
        },
        sage: {
          600: '#597E6D', // Sage Leaf
          400: '#7FA088', // Willow Green
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
