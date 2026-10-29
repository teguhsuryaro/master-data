import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F79721',
          hover: '#DF7E0B',
          soft: '#FFF7ED',
          border: '#FED7AA',
        },
        surface: {
          canvas: '#F4F6F8',
          card: '#FFFFFF',
        },
        carbon: {
          DEFAULT: '#141619',
          light: '#1A1D21',
          muted: '#24272D',
          border: '#2E323A',
        },
        txt: {
          primary: '#18181B',
          secondary: '#52525B',
          muted: '#71717A',
        },
        border: {
          structural: '#E4E4E7',
        },
        semantic: {
          debit: {
            text: '#0284C7',
            bg: '#E0F2FE',
          },
          credit: {
            text: '#D97706',
            bg: '#FEF3C7',
          },
          contra: {
            text: '#BE123C',
            bg: '#FFE4E6',
          },
          available: {
            text: '#16A34A',
            bg: '#DCFCE7',
          },
          rented: {
            text: '#D97706',
            bg: '#FEF3C7',
          },
          maintenance: {
            text: '#DC2626',
            bg: '#FEE2E2',
          },
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'tactile-sm': '0 1px 2px 0 rgba(20, 22, 25, 0.05)',
        'tactile-md': '0 4px 6px -1px rgba(20, 22, 25, 0.08), 0 2px 4px -2px rgba(20, 22, 25, 0.05)',
        'tactile-lg': '0 10px 15px -3px rgba(20, 22, 25, 0.08), 0 4px 6px -4px rgba(20, 22, 25, 0.05)',
        'flight-case': '0 20px 25px -5px rgba(20, 22, 25, 0.3), 0 8px 10px -6px rgba(20, 22, 25, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
