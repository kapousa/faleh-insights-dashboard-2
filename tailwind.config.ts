import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate"; // نستخدم import بدلاً من require

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
        // الألوان الجديدة من الصورة (Franchise Middle East)
        brand: {
          purple: "#5222dc",    // الأرجواني الأساسي
          gold: "#ffcc00",      // الأصفر الذهبي
          navy: "#0a1d37",      // الكحلي للنصوص
          slate: "#f1f5f9",     // الخلفيات الفاتحة
        },
        primary: {
          DEFAULT: "#5222dc",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#ffcc00",
          foreground: "#0a1d37",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [animate], // هنا نضع المتغير الذي استوردناه في الأعلى
} satisfies Config;