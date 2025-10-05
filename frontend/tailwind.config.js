/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'off-white': '#f4f4f4',
        'primary-yellow': '#f7ff58',
        'accent-blue': '#4361ee',
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        brutal: '4px 4px 0px #000',
        'brutal-dark': '4px 4px 0px #f7ff58',
      },
    },
  },
  plugins: [],
};
