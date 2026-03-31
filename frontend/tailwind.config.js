import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0a0e1a",
        indigoGlow: "#6366f1",
        cyanGlow: "#22d3ee",
      },
      boxShadow: {
        glow: "0 10px 35px rgba(99, 102, 241, 0.25)",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};
