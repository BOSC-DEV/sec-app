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
          dark: {
            DEFAULT: "#0A1729", // Slightly lighter dark background
            text: "#C8C8C9",    // Light gray for improved readability
            accent: "#1EAEDB",  // Bright blue for highlights
            border: "#2C3E50"   // Slightly lighter border
          }
        }
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
      textColor: {
        dark: {
          primary: "#C8C8C9",   // Light gray for primary text
          secondary: "#8E9196", // Neutral gray for secondary text
          muted: "#666B73"      // Muted gray for less important text
        }
      },
      backgroundColor: {
        dark: {
          primary: "#1A1F2C",   // Dark purple background
          secondary: "#222222"  // Dark charcoal secondary background
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
