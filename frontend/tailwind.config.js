/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070604",
        surface: "#0e0d0a",
        card: "#14120e",
        border: "rgba(255, 255, 255, 0.08)",
        gold: {
          light: "#f5d77f",
          DEFAULT: "#d4af37",
          dark: "#aa820a",
          glow: "rgba(212, 175, 55, 0.15)"
        }
      },
      fontFamily: {
        sans: ['"Albert Sans"', 'Inter', 'sans-serif'],
        display: ['"Alumni Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
};
