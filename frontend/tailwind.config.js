import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          50: "#f0f7f7",
          100: "#d4ebeb",
          200: "#a8d6d6",
          300: "#6bb8b8",
          400: "#3a9494",
          500: "#1a6b6b",
          600: "#1a5555",
          700: "#1a4444",
          800: "#1a3a3a",
          900: "#0f2828",
          950: "#081a1a",
        },
        cream: {
          50: "#fdfcfa",
          100: "#f9f5ef",
          200: "#f5f0e8",
          300: "#ebe3d5",
          400: "#d4c9b8",
          500: "#9a8f80",
          600: "#756b5e",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,58,58,0.06), 0 1px 2px rgba(26,58,58,0.04)",
        cardHover:
          "0 10px 25px -5px rgba(26,58,58,0.08), 0 8px 10px rgba(26,58,58,0.04)",
        sidebar: "4px 0 20px rgba(0,0,0,0.12)",
        chat: "-4px 0 15px rgba(0,0,0,0.06)",
        soft: "0 2px 8px rgba(26,58,58,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [forms],
};
