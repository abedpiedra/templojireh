import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d14f42',
          dark: '#b8433a',
        },
        secondary: {
          DEFAULT: '#61a229',
          dark: '#4e8221',
        },
        dark: {
          DEFAULT: '#1a1a2e',
          light: '#2d2d44',
        },
      },
    },
  },
  plugins: [],
}
export default config
