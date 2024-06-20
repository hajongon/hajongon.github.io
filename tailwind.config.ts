import { Exo_2 } from 'next/font/google'
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1536px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
        mobile: { max: '639px' },
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      rotate: {
        '5': '5deg',
        '15': '15deg',
        '30': '30deg',
        '60': '60deg',
        '120': '120deg',
        '-5': '-5deg',
        '-15': '-15deg',
        '-30': '-30deg',
        '-60': '-60deg',
        '-120': '-120deg',
      },
      width: {
        page: 'var(--page-width)',
        content: 'var(--content-width)',
      },
      spacing: {
        page: 'var(--page-top)',
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: '1.6rem',
            maxWidth: 'none', // Remove max-width for prose
            'h2, h3': {
              marginTop: '4rem',
              scrollMarginTop: '4rem',
            },
            p: {
              marginTop: '4rem',
              marginBottom: '4rem',
            },
            '.callout-contents > p': {
              margin: 0,
            },
            code: {
              counterReset: 'line',
            },
            // Inline code only

            '.code-header': {
              padding: '0.5rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              color: '#afafaf',
              fontSize: '1.2rem',
            },

            ':not(pre) > code': {
              fontWeight: 'inherit',
              position: 'relative',
              bottom: 1,
              margin: '0 3px',
              color: '#eb5757',
              backgroundColor: 'rgba(135,131,120,0.15)',
              fontFamily:
                '"SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace',
              borderRadius: 3,
              padding: '0.2em 0.4em',
              overflowWrap: 'break-word',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            'code[data-line-numbers] > [data-line]::before': {
              counterIncrement: 'line',
              content: 'counter(line)',
              /* Other styling */
              display: 'inline-block',
              width: '1rem',
              marginRight: '1.4rem',
              textAlign: 'right',
              color: 'lightgrey',
              fontSize: '0.7rem',
            },
            'code[data-line]': {
              display: 'block',
              paddingLeft: '4rem',
              position: 'relative',
            },
            pre: {
              position: 'relative',
              padding: '1rem 0',
              paddingRight: '1rem',
              paddingBottom: '2rem !important',
              color: 'var(--shiki-light)',
              backgroundColor: 'var(--shiki-light-bg)',
              border: '1px solid #e5e7eb',
            },
            '.dark pre': {
              backgroundColor: 'var(--shiki-dark-bg)',
              color: 'var(--shiki-dark)',
              border: '1px solid #374151',
            },
            'figure pre': {
              padding: '2rem 0 2rem 0',
            },
            'pre > code': {
              display: 'block',
              padding: '0 1rem',
              counterReset: 'line',
            },
            'pre code [data-line]::before': {
              content: 'counter(line)',
              counterIncrement: 'line',
              position: 'absolute',
              paddingTop: '0.3rem',
              left: '1rem',
              color: 'grey',
              fontSize: '1.2rem',
              textAlign: 'right',
              width: '3rem',
            },
            'pre code [data-line]': {
              borderLeft: '1px solid #e5e7eb',
              paddingLeft: '2rem',
              marginLeft: '5rem',
            },
            '[data-highlighted-line]': {
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
            },
            u: {
              textUnderlineOffset: '4px',
              textDecorationThickness: 1,
              fontWeight: 600,
            },
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config

export default config
