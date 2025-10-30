import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00FFF0", // Neon Cyan
        "secondary": "#FFD166", // Rich Gold
        "background-light": "#E8E9EB",
        "background-dark": "#101820", // Dark Charcoal
        "surface-dark": "#1D2939", // Lighter shade for UI elements
        "text-light": "#101820",
        "text-dark": "#E8E9EB", // Muted Off-White
        "text-muted-dark": "#98A2B3",
      },
      fontFamily: {
        "display": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "body": ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
} satisfies Config;