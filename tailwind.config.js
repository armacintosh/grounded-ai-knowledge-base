/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#1C2E36', // Deep Slate
          800: '#2D3436', // Slate Custom (from example)
          100: '#E1E9EA', // Arctic Mist
        },
        sage: {
          600: '#597E6D', // Sage Leaf
          400: '#7FA088', // Willow Green
        },
        primary: '#1C2E36', // Semantic alias
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
    },
  },
  plugins: [],
};
