import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        brand: {
          // verdes
          50: "#E4F3F1",
          100: "#AFDAD5",
          200: "#7AC2B9",
          300: "#5FB6AB",
          400: "#2A9D8F",

          // azules
          450: "#9ac4eb",
          500: "#415D69",
          550: "#264653",

          //amarillonaranjado
          600: "#e9c46a",
          650: "#f4a261",

          //naranja
          700: "#F0A592",
          750: "#ED937D",
          800: "#e76f51",

          //casi negro
          900: "#2B2933",
        },
      },
    },
  },
  plugins: [],
};
export default config;
