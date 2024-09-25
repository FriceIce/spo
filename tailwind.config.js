/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify_black: "#121212",
        spotify_gray: "#cccccc",
        spotify_green: "#1ed760",
      },
      screens: {
        'l': '850px',
      }
    },
  },
  plugins: [],
};
