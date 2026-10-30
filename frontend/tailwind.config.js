/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": "#E53935",
        "brand-black": "#111111",
        "brand-black-secondary": "#1B1B1B",
        "brand-white": "#FFFFFF",
        "brand-light-bg": "#F5F5F5",
        "brand-grey": "#737373",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
