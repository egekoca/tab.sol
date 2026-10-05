import type { Config } from "tailwindcss";

// Marka paleti: brand/sheet/tab-brand-sheet.png
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cherry: "#6B1D2C",
        "cherry-bright": "#E0455F",
        "cherry-dim": "#431220",
        obsidian: "#0E0E10",
        cloud: "#F5F5F7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};

export default config;
