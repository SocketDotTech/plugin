/** @type {import('tailwindcss').Config} */
module.exports = {
  enabled: process.env.NODE_ENV === 'publish',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
