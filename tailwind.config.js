/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: '#3f3f37',
        battleship: '#878472',
        dutch: '#d6d6b1',
        true: '#586ba4',
        flame: '#de541e',
      },
      width: {
        fullscreen: '700px',
      },
    },
  },
  plugins: [],
};
