/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#FF6584',
        accent: '#43E97B',
        background: '#F5F7FB',
        dark: '#333333',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'firework': 'firework 1s forwards',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'text': 'text 5s ease infinite',
        'fall': 'fall 7s linear forwards',
        'fall-slow': 'fall 10s linear forwards',
        'fall-fast': 'fall 4s linear forwards',
        'sway': 'sway 3s ease-in-out infinite',
      },
      keyframes: {
        firework: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-15px) rotate(5deg)' },
          '50%': { transform: 'translateY(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(15px) rotate(-5deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(150%)' },
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        fall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.7' },
        },
        sway: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(30px)' },
        },
      },
    },
  },
  plugins: [],
}
