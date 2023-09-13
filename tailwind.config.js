/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /* backgroundImage: {
        "app": "url('/img/barber1.jpeg')"
      },
      colors: {
        "vtd-primary": colors.blue
      } */
    },
  },
  plugins: [],
}

