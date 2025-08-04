/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on 'dark' class on HTML element
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define 'inter' custom font family
      },
      // Custom colors to match the desired theme
      colors: {
        'qr-dark-bg': '#121212',
        'qr-sidebar-dark': '#1f1f1f',
        'qr-main-dark': '#222',
        'qr-text-light': '#e0e0e0', // For general text in dark mode
        'qr-primary-accent': '#4fc3f7', // For QRMark title and active buttons
        'qr-btn-text-dark-contrast': '#121212', // Text color for active buttons in dark mode
        'qr-btn-hover-dark': '#333', // Hover background for inactive sidebar tabs in dark mode

        'qr-light-bg': '#f5f5f5',
        'qr-sidebar-light': '#e0e0e0',
        'qr-main-light': '#fff',
        'qr-text-dark': '#121212', // For general text in light mode
        'qr-primary-light-accent': '#0077cc', // For QRMark title and active buttons in light mode
        'qr-btn-text-light-contrast': '#fff', // Text color for active buttons in light mode
        'qr-btn-hover-light': '#005fa3', // Hover background for inactive sidebar tabs in light mode
      },
    },
  },
  plugins: [],
}
