import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: { 400: "#d8b25b", 500: "#c79a36", 600: "#a87a1f" },
        ink: "#0b0b0c",
        cream: "#f7f3ea"
      },
      boxShadow: { premium: "0 20px 60px rgba(0,0,0,.18)" }
    }
  },
  plugins: []
} satisfies Config;
