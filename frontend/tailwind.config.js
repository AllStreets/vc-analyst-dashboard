export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        'dark-lighter': '#1a1f35',
        competitive: '#10b981',
        'competitive-dark': '#059669',
        market: '#f59e0b',
        'market-dark': '#d97706',
        founder: '#7c3aed',
        'founder-dark': '#6d28d9',
        thesis: '#4f46e5',
        'thesis-dark': '#4338ca',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
