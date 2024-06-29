/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem', // Puedes ajustar este valor según tus necesidades
        '5xl': '2.5rem',
      }, colors: {
        'custom-gray': '#19191B',
      },
    },
  },
  plugins: [],
}
