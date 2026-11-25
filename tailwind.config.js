/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vi-bg': 'var(--bg-primary)',
        'vi-surface': 'var(--bg-surface)',
        'vi-text': 'var(--text-primary)',
        'vi-muted': 'var(--text-muted)',
        'vi-accent': 'var(--accent)',
        'vi-border': 'var(--border)',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
