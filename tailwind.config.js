/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        main_dark:      '#191919', // Main dark
        light_gray:     '#E4E4E4', // Light UI elements, cards
        purewhite:     '#FCFCFC', // Background, highlights, text
        yellow:        '#efc11a', // Primary accent, buttons, highlights
        light_brown:     '#CEB8AD', // Neutral, backgrounds, cards
        deep_green:      '#236571', // Accent, navigation, status
        slatebluegray: '#2E2F34', // Accent
      }
    },
  },
  plugins: [],
}