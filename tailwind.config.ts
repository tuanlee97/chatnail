import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'progress': '#fe2c55',
      },
      animation: {
        'zoom-in': 'zoomIn 0.5s ease-in-out',
        'zoom-out': 'zoomOut 0.5s ease-in-out',
        'zoom-in-out': 'zoomInOut 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'wave': 'wave  1.5s ease-in-out infinite',
        'expandWidth': 'expandWidth 2.5s ease-in-out',
      },
      keyframes: {
        expandWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        wave: {
          '0%': {
            transform: "rotate(0deg)"
          },
          '15%': {
            transform: "rotate(20deg)"
          },
          '30%': {
            transform: "rotate(0deg)"
          },
          '45%': {
            transform: "rotate(-20deg)"
          },
          '60%': {
            transform: "rotate(0deg)"
          },
          '75%': {
            transform: "rotate(10deg)"
          },
          '85%': {
            transform: "rotate(0deg)"
          },
          '100%': {
            transform: "rotate(0deg)"
          }
        },

        zoomIn: {
          '0%': {
            transform: 'scale(0.5)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        zoomOut: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(0.5)',
          },
        },
        zoomInOut: {
          '0%': {
            transform: 'scale(1)',   // Bắt đầu ở kích thước bình thường
          },
          '50%': {
            transform: 'scale(1.1)', // Phóng to 20% tại giữa chu kỳ
          },
          '100%': {
            transform: 'scale(1)',   // Quay lại kích thước ban đầu
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' }, // Bắt đầu từ dưới và mờ đi
          '100%': { transform: 'translateY(0)', opacity: '1' },    // Cuối cùng là ở vị trí gốc và hiện lên
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0%)', opacity: '1' }, // Bắt đầu từ dưới và mờ đi
          '100%': { transform: 'translateY(-100)', opacity: '0' },    // Cuối cùng là ở vị trí gốc và hiện lên
        },
      },
    },
  },
  plugins: [],
}
export default config
