/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}" // Add this just in case

  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0F1419',
        card: '#1C2229',
        primary: '#22C55E',
        muted: '#94A3B8',
        border: '#2D3748',
      },
    },
  },
  plugins: [],
};