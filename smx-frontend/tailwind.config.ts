import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          400: '#272425',
          500: '#231F20',
        },
        primary: {
          400: '#0068ac',
          500: '#005C98',
        },
        secondary: '#478ECC',
        accent: '#F5F2EE',
        background: '#241F20',
        textPrimary: '#231F20',
        textSecondary: '#848484',
        textAdditional: '#4D4D4D',
        bgInput: '#F5F2EE50',
        borderInput: '#F5F2EE',
        borderFolders: '#D0D0D0',
      },
      fontFamily: {
        apercu: [
          'Apercu Pro',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        /*
        h1: ['38px', '1.2'],
        'h1-lg': ['48px', '48px'],
        h2: ['40px', '1.2'],
        h3: ['28px', '1.2'],
        h4: ['24', '1.2'],
        h5: '',
        //p: ['18px', '1.2'],
        'p-m': ['20px', '1.2'],
        
         */
      },
      borderRadius: {
        full: '9999px',
      },
      spacing: {
        '2vh': '2vh',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
      },

      backdropBlur: {
        lg: '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
