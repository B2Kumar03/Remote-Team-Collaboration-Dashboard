/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBackground: '#F5F7FA', // Light grayish blue background
        primaryBlue: '#007BFF',     // Bright blue for buttons
        darkText: '#1E1E1E',        // Dark color for text (can be used for dark mode)
        formField: '#FFFFFF',       // White form fields
        buttonHover: '#0056B3',     // Deeper blue for hover state
      },
    },
  },
  plugins: [],
}
