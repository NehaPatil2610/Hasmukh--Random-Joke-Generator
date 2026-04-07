/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sunset: {
          deep: "#4A1D96",
          warm: "#FF8C42",
          soft: "#FF3E7F",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        devanagari: ["var(--font-noto-sans-devanagari)", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
