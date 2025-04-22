/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        custom: "566px",
        custom1: "487px",
        custom2: "768px",
        tablet: "1024px",
      }
    },
  },
  plugins: [],
};