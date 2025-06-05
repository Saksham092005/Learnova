/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "home-heading-small": ["28px","34px"],
        "home-heading-large": ["48px","56px"],
        /* …other sizes… */
      }
    },
  },
  plugins: [],
};
