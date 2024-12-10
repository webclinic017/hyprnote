/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        border: "rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
