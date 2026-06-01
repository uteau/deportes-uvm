/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uvm-primary': '#101820',      // Negro institucional
        'uvm-secondary': '#5B6770',    // Gris institucional
        'uvm-light': '#f8f9fa',        // Gris muy claro
        'uvm-accent': '#c00',          // Rojo UVM
        'uvm-accent-dark': '#900',     // Rojo oscuro UVM
        'uvm-text': '#4C4E56',         // Color para textos
      },
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}