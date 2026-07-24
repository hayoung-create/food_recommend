/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          soft: '#E8F5E9',
        },
        secondary: {
          DEFAULT: '#81C784',
          soft: '#F1F8F4',
        },
        accent: {
          DEFAULT: '#FFB74D',
          soft: '#FFF8E1',
        },
        background: '#F7F9F7',
        card: '#FFFFFF',
        border: '#E5E7EB',
        ink: {
          DEFAULT: '#1F2937',
          muted: '#6B7280',
        },
        success: '#2E7D32',
        warning: '#FFB74D',
        danger: {
          DEFAULT: '#EF5350',
          soft: '#FFEBEE',
        },
      },
      maxWidth: {
        content: '1120px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(31, 41, 55, 0.06)',
        softHover: '0 16px 40px rgba(31, 41, 55, 0.10)',
        card: '0 4px 24px rgba(31, 41, 55, 0.05)',
      },
      borderRadius: {
        card: '24px',
        button: '16px',
        input: '16px',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
