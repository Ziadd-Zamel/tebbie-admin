
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        drive: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        drive: 'drive 2s linear infinite',
      },
      fontFamily: {
        'almarai': ['Almarai', 'sans-serif'],
      },
      colors: {
        'primary': '#02A09B',
        'Secondary': '#F2FAFA',
        'primary-gradient-start': '#02A09B',
        'primary-gradient-end': '#013A38',
  
      },
      
    },
  },
  plugins: [
  ],
};
