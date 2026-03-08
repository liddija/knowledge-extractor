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
        brand: {
          DEFAULT: "#E60023",
          dark: "#CC001F",
          light: "#FFF0F0",
        },
        warm: {
          50: "#F5F5F0",
          100: "#EEEDE8",
        },
      },
    },
  },
  plugins: [],
};
export default config;
