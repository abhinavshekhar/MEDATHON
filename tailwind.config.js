/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#effbff", 100: "#d9f6ff", 200: "#b9edff", 300: "#7ddfff",
          400: "#34c8f5", 500: "#08aee3", 600: "#078dc1", 700: "#08719d",
          800: "#0c5c80", 900: "#104c69",
        },
        medathon: {
          sidebar: "#071421",
          surface: "#f4f8fb",
          border: "#e1eaf0",
          muted: "#66758a",
          "nav-muted": "#8496a9",
          "nav-active": "#d8f7ff",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.03), 0 12px 30px rgb(16 40 57 / 0.04)",
        "card-hover": "0 18px 36px rgb(16 40 57 / 0.10)",
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
