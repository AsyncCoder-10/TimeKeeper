/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        tracker: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          brand: '#6366f1',
          accent: '#0ea5e9',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
