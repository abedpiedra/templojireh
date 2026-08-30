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
        // Tokens oficiales del kit de marca (marca/.../colores-marca.css).
        // No se ajustan a ojo: son los valores que entrega el manual.
        primary: {
          DEFAULT: '#d6122f', // rojo de marca
          dark: '#a80e25',
          light: '#ff4a5f', // rojo llama
          tint: 'rgba(214, 18, 47, 0.10)',
        },
        // Vino: tramo bajo del degradado de la llama
        secondary: {
          DEFAULT: '#690d24',
          dark: '#4b0919',
          tint: 'rgba(105, 13, 36, 0.10)',
        },
        // Grafito, no azul marino
        dark: {
          DEFAULT: '#1c1c22',
          light: '#3a3a44',
        },
        // Verde solo como color de estado (exito), nunca como color de marca
        success: {
          DEFAULT: '#248a3d',
          tint: 'rgba(36, 138, 61, 0.10)',
        },
        ink: {
          DEFAULT: '#1c1c22',
          secondary: 'rgba(28, 28, 34, 0.62)',
          tertiary: 'rgba(28, 28, 34, 0.42)',
          quaternary: 'rgba(28, 28, 34, 0.20)',
        },
        separator: 'rgba(28, 28, 34, 0.10)',
        canvas: {
          DEFAULT: '#ffffff',
          sunken: '#f4f4f6', // humo
          raised: '#ffffff',
        },
      },
      fontFamily: {
        // Montserrat: la tipografia que define el manual de marca.
        // El stack del sistema queda de respaldo inmediato.
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
        chip: '0 1px 2px rgba(28, 28, 34, 0.06), 0 1px 1px rgba(28, 28, 34, 0.04)',
        raised: '0 2px 8px rgba(28, 28, 34, 0.06), 0 1px 2px rgba(28, 28, 34, 0.04)',
        floating: '0 12px 32px rgba(28, 28, 34, 0.10), 0 2px 8px rgba(28, 28, 34, 0.06)',
        sheet: '0 24px 64px rgba(28, 28, 34, 0.20), 0 4px 12px rgba(28, 28, 34, 0.08)',
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
