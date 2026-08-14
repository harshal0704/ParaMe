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
        "surface-raised": "#14130f",
        "surface-subtle": "#1c1a14",
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
        display: ['"Alumni Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        "serif-accent": ['"Newsreader"', 'serif'],
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
      },
      animation: {
        'marquee': 'marquee 45s linear infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
