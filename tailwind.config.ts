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
        // Paleta tomada del logo: llama carmesi -> granate -> negro,
        // sobre el gris muy claro del fondo del isotipo.
        primary: {
          DEFAULT: '#c80f2c',
          dark: '#a20d25',
          light: '#e4132f',
          tint: 'rgba(200, 15, 44, 0.10)',
        },
        // Granate profundo del tramo bajo de la llama
        secondary: {
          DEFAULT: '#7b122a',
          dark: '#5c0d1f',
          tint: 'rgba(123, 18, 42, 0.10)',
        },
        // El negro del isotipo, no un azul marino
        dark: {
          DEFAULT: '#101012',
          light: '#26262b',
        },
        // Verde solo como color de estado (exito), nunca como color de marca
        success: {
          DEFAULT: '#248a3d',
          tint: 'rgba(36, 138, 61, 0.10)',
        },
        ink: {
          DEFAULT: '#101012',
          secondary: 'rgba(16, 16, 18, 0.62)',
          tertiary: 'rgba(16, 16, 18, 0.42)',
          quaternary: 'rgba(16, 16, 18, 0.20)',
        },
        separator: 'rgba(16, 16, 18, 0.10)',
        canvas: {
          DEFAULT: '#ffffff',
          sunken: '#f5f5f7',
          raised: '#ffffff',
        },
      },
      fontFamily: {
        // Nunito Sans como voz de marca; el stack del sistema queda de respaldo
        // inmediato (ya trae optical sizing y tablas de tracking).
        sans: [
          'var(--font-brand)',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        // Radios continuos, mas generosos: superficies grandes = radio mayor
        card: '1.25rem',
        sheet: '1.5rem',
        control: '0.75rem',
      },
      boxShadow: {
        // Sombras conscientes del contexto: superficie mas grande = sombra mas profunda
        chip: '0 1px 2px rgba(16, 16, 18, 0.06), 0 1px 1px rgba(16, 16, 18, 0.04)',
        raised: '0 2px 8px rgba(16, 16, 18, 0.06), 0 1px 2px rgba(16, 16, 18, 0.04)',
        floating: '0 12px 32px rgba(16, 16, 18, 0.10), 0 2px 8px rgba(16, 16, 18, 0.06)',
        sheet: '0 24px 64px rgba(16, 16, 18, 0.20), 0 4px 12px rgba(16, 16, 18, 0.08)',
      },
      transitionTimingFunction: {
        // Aproximaciones CSS a resortes criticamente amortiguados (sin overshoot)
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
        'spring-in': 'cubic-bezier(1, 0, 0.68, 0.28)',
        // Con rebote leve: solo para interacciones con momentum
        bounce: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },
      transitionDuration: {
        // "response" en ms: 0.3-0.4s por defecto
        press: '100',
        response: '400',
        'response-fast': '300',
      },
      backdropBlur: {
        material: '20px',
        thick: '32px',
      },
      keyframes: {
        materialize: {
          '0%': { opacity: '0', transform: 'scale(0.96)', backdropFilter: 'blur(0px)' },
          '100%': { opacity: '1', transform: 'scale(1)', backdropFilter: 'blur(20px)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        materialize: 'materialize 400ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'rise-in': 'rise-in 400ms cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },
  plugins: [],
}
export default config
