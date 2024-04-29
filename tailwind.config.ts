import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        "3xs": "8px",
        "2xs": "10px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(#013E0A,#007205)",
        "gradient-first": "radial-gradient(#B78F00,rgba(218,105,0,0.65))",
        "gradient-second":
          "radial-gradient(rgba(79,183,55,0.9912),rgba(0,168,218,0.65))",
        "gradient-third":
          "radial-gradient(rgba(26,143,122),rgba(148,0,218,0.65))",
      },
      colors: {
        primary: {
          700: "#0F0F0F",
        },
        secondary: {
          700: "#1FC04D",
          300: "#175611",
          200: "#BBF3D5",
          100: "#96C4CE",
        },
        grey: {
          300: "#D9D9D9",
          200: "#787676",
          100: "#373737",
        },
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
        "correct-flash": {
          from: { backgroundColor: "white" },
          to: { backgroundColor: "green" },
        },
        "wrong-flash": {
          from: { backgroundColor: "white" },
          to: { backgroundColor: "red" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "correct-flash": "correct-flash 1s ease-in-out infinite",
        "wrong-flash": "wrong-flash 1s ease-in-out infinite",
      },
      data: {
        correct: 'correct="true"',
        wrong: 'wrong="true"',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
