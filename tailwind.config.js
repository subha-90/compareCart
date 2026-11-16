/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CompareCart Brand Identity
        cc: {
          navy: '#101936',
          blue: '#2864FF',
          purple: '#7047F5',
          'bg-light': '#F8F9FC',
          'bg-dark': '#101116',
          'surface-light': '#FFFFFF',
          'surface-dark': '#1B1D27',
          'surface-elevated': '#252837',
          'border-light': '#E8ECF4',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
          success: '#16A36A',
          'text-dark': '#101936',
          'text-muted': '#64748B',
          'text-light': '#F8FAFC',
          'text-muted-dark': '#94A3B8',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#16A36A',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        pie: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2864FF',
          600: '#2563eb',
          700: '#101936',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 25, 54, 0.06), 0 2px 6px -1px rgba(16, 25, 54, 0.04)',
        'elevated': '0 20px 40px -8px rgba(16, 25, 54, 0.1), 0 6px 12px -2px rgba(16, 25, 54, 0.06)',
        'glow-blue': '0 10px 30px -5px rgba(40, 100, 255, 0.35)',
        'glow-purple': '0 10px 30px -5px rgba(112, 71, 245, 0.35)',
        'glow-dark': '0 20px 50px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
