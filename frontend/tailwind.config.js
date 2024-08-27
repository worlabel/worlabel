/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e6e6e6',
        300: '#d9d9d9',
        400: '#b3b3b3',
        500: '#757575',
        600: '#444444',
        700: '#383838',
        800: '#2c2c2c',
        900: '#1e1e1e',
        1000: '#111111',
      },
      primary: '#1177ff',
    },

    fontFamily: {
      sans: [
        'Pretendard Variable',
        'Pretendard',
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'Roboto',
        'Helvetica Neue',
        'Segoe UI',
        'Apple SD Gothic Neo',
        'Noto Sans KR',
        'Malgun Gothic',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'sans-serif',
      ],
    },
  },
  plugins: [],
};
