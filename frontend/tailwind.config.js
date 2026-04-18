/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1a1a2e",
        accent: "#e94560",
        gold: "#d4af37",
        cream: "#faf8f5",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease forwards",
        "slide-in-left": "slideInLeft 0.7s ease forwards",
        "pulse-gold": "pulseGold 2s infinite",
      },
    },
  },
  plugins: [],
};
