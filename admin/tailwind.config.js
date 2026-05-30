/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'uvm-text': '#5B6770',
        'uvm-bg': '#ffffff',
        'uvm-primary': '#003366',  // Azul institucional (típico de UVM)
        'uvm-secondary': '#4A90E2',
        'uvm-success': '#2E7D32',
        'uvm-warning': '#ED6C02',
        'uvm-error': '#D32F2F',
      },
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}