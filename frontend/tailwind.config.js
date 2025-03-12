/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        orbit: 'orbit 10s linear infinite',
        ascend: 'ascend 1s ease-out forwards',
        glitch: 'glitch 1.5s infinite',
        'glitch-shadow': 'glitch-shadow 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ascend: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(0 0 0 0)' },
          '5%': { clipPath: 'inset(10% 0 10% 0)' },
          '10%': { clipPath: 'inset(0 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'glitch-shadow': {
          '0%': { transform: 'translate(0, 0)' },
          '5%': { transform: 'translate(2px, -2px)' },
          '10%': { transform: 'translate(-2px, 2px)' },
          '15%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
    },
  },
  plugins: [],
};