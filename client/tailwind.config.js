const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.tsx', './public/**/*.html'],
    enabled: process.env.NODE_ENV === 'production',
  },
  darkMode: false,
  theme: {
    colors: {
      ...defaultTheme.colors,
    },
    extend: {
      fontFamily: {
        display: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
