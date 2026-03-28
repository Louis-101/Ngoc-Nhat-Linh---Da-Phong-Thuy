import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C5A028',
        'primary-dark': '#A6851E',
        secondary: '#4E342E',
        accent: '#F5F5DC',
        charcoal: '#2C1810',
        'beige-subtle': '#FAF7F2',
        cream: '#FFFDD0',
        brown: '#5D4037',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C5A028 0%, #F9E498 50%, #C5A028 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
