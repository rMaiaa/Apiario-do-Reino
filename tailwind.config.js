/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Apiario-do-Reino-main/**/*.{html,js}"], // Define os arquivos onde o Tailwind busca classes
  darkMode: 'class', // 'media' para ativar pelo sistema, 'class' para ativar manualmente
  theme: { 
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    container: {
      center: true,
      padding: '4rem', // Garante espaçamento interno
    },
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif",
      },
      colors: {
        primary: '#FDE010',
        secundary: '#000000',
      },
      backgroundImage: {
        home: "url('/assets/abelha 1.png')",
      },
    },
  },
  plugins: [],
};