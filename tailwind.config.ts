import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teal: {
          DEFAULT: "#7FB3AE",
          dark: "#6A9E99",
          light: "#E8F4F2",
        },
        coral: {
          DEFAULT: "#E8735A",
          dark: "#D4604A",
          light: "#FFF0EC",
        },
        orange: {
          DEFAULT: "#D4923F",
          dark: "#BF8236",
          light: "#FFF5E6",
        },
        charcoal: "#2D3436",
        cream: {
          DEFAULT: "#F5F3EE",
          dark: "#ECEAE5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
