/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007bff',
          hover: '#0056b3',
        },
        accent: {
          DEFAULT: '#aa3bff',
          bg: 'rgba(170, 59, 255, 0.1)',
        }
      }
    },
  },
  plugins: [],
}
