/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5542F6',
        highlight: '#d5d4fa',
        bgGray: 'fbfafd'
      }
    },
  },
  plugins: [],
};

export default config;

