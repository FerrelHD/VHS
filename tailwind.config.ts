import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crt: {
          dark: "#050505",
          tube: "#0b0b0c",
          bezel: "#151517",
          phosphor: "#ece9e1",
          muted: "rgba(236, 233, 225, 0.45)",
          amber: "#f5a742",
          red: "#ef4444",
        },
      },
      fontFamily: {
        bit: ["NeueBit", "monospace"],
        mono: [
          "PPNeueMontrealMono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: [
          "PPNeueMontrealMono",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
