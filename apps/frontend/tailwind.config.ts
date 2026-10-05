import type { Config } from "tailwindcss";

// Marka paleti: brand/sheet/tab-brand-sheet.png
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cherry: "#6B1D2C",
        obsidian: "#0E0E10",
        cloud: "#F5F5F7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
