import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37', // Vàng Kim chuẩn
        'primary-dark': '#B8860B',
        secondary: '#3E2723', // Nâu Trầm sang trọng
        accent: '#FAF9F6', // Trắng Sứ nhẹ nhàng
        charcoal: '#2C1810',
        'gold-light': '#F9E498',
        'brown-soft': '#6D4C41',
        'white-pure': '#FFFFFF',
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
