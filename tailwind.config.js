/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      maxWidth: {
        'container': '1400px',
        'content': '1100px',
        'navbar': '1400px',
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
          lighter: '#A5B4FC',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        accent: {
          purple: '#8B5CF6',
          orange: '#F59E0B',
          pink: '#EC4899',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'gradient-hero': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 30%, #F8FAFC 60%, #FFFFFF 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 25%, #EC4899 50%, #F59E0B 75%, #10B981 100%)',
      },
      boxShadow: {
        'colored': '0 8px 30px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}

