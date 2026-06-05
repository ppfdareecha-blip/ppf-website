/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use these in your HTML: font-futura or font-helvetica
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        futura: ['var(--font-futura)', 'sans-serif'],
        helvetica: ['var(--font-helvetica)', 'sans-serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        lora: ['var(--font-lora)', 'sans-serif'],
        neuton: ['var(--font-neuton)', 'sans-serif']
      },
      colors: {
        vibrant: {
          violet: "#8B5CF6",
          offwhite: "#F8FAFC",
          teal: "#10B981",
          charcoal: "#334155",
          gray: "#E2E8F0",
        },
        mono: {
          deep: "#583076",
          mid: "#7C3AED",
          lilac: "#FAF5FF",
          silver: "#CBD5E1",
          plum: "#2E1065",
        },
//         ppf: {
//   purple:"#4C1D95",
//   teal: "#00000",
//   orange: "#10B981",
// }

        ppf: {
  purple:"#583076",
  teal: "#00000",
  orange: "#10B981",
  lilac:"#D6C1E8"
}
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};