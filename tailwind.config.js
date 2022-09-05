/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/src/**/*.{html,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
