/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0F1219',
        surface:  '#161B27',
        card:     '#1E2535',
        'card-hover': '#252D40',
        border:   '#2A3347',
        accent:   '#3B82F6',
        critical: '#EF4444',
        important:'#F59E0B',
        muted:    '#64748B',
        muted2:   '#94A3B8',
        success:  '#10B981',
      },
    },
  },
  plugins: [],
}
