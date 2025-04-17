
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ICC Theme Colors
        icc: {
          blue: {
            DEFAULT: "#13294B",
            light: "#1D3A6A", 
            dark: "#0A1729",
          },
          gold: {
            DEFAULT: "#C8B06B",
            light: "#D9C795",
            dark: "#A69149",
          },
          red: {
            DEFAULT: "#A91B0D",
            light: "#C3241A",
            dark: "#8A1407",
          },
          gray: {
            DEFAULT: "#5A5A5A",
            light: "#F5F5F5",
            dark: "#333333",
          },
        },
        // Add specific dark mode text colors
        "dark-text": {
          DEFAULT: "#FFFFFF",
          primary: "#F1F1F1",
          secondary: "#C8C8C9",
          muted: "#9F9EA1",
        },
        "dark-bg": {
          DEFAULT: "#1A1F2C",
          card: "#1A1F2C",
          input: "#2A2F3C",
          hover: "#2C3242",
        },
        // Adding sidebar theme colors to match the image
        sidebar: {
          DEFAULT: "#1A1F2C",      // Dark blue background from image
          foreground: "#FFFFFF",   // White text
          border: "#2C3242",       // Slightly lighter blue for borders
          accent: "#2C3242",       // Hover state background
          "accent-foreground": "#FFFFFF", // Hover state text
          ring: "#C8B06B",         // ICC gold for focus rings
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["Cambria", "Georgia", "serif"],
        sans: ["Open Sans", "Arial", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-in-out",
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        "hero-pattern": "url('/hero-background.jpg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
