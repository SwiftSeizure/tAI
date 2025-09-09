/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./src/**/*"],
  theme: {
    extend: {  
      fontFamily: { 
        nunito: ['Nunito', 'sans-serif']
      },

      keyframes: {
        fallBounce: {
          '0%': { transform: 'translateY(-4rem)', opacity: '0' },
          '70%': { transform: 'translateY(0.2rem)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }, 
        scrollGradient: {
          '0%' : { backgroundPosition:'0% 0%'},
          '100%': {backgroundPosition: '0% 200%' },

        }, 
        fadeInSlideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fallBounce: 'fallBounce 0.5s ease-out forwards', 
        scrollGradient: 'scrollGradient 10s ease infinite', 
        'fade-in-slide-up': 'fadeInSlideUp 0.5s ease-out forwards',
      }, 
    },
  },
  plugins: [],
}
