import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f4ff",
          100: "#e5e8ff",
          200: "#c6c9ff",
          300: "#a2a6ff",
          400: "#7d80ff",
          500: "#5f5fff",
          600: "#4d4bdb",
          700: "#3d39b7",
          800: "#2e2a92",
          900: "#201d72"
        }
      }
    }
  },
  plugins: []
};

export default config;
