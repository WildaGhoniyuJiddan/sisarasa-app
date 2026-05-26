/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds - Light Theme
        'bg-primary': '#FFFFFF',
        'surface-container': '#F5F5F5',
        'surface-container-high': '#E8E8E8',
        'surface-container-highest': '#D5D5D5',

        // Accents - Green as Secondary
        'accent-primary': '#10B981', // Emerald green
        'accent-secondary': '#34D399',
        'accent-secondary-alt': '#6EE7B7',

        // Neutrals
        'outline': '#9CA3AF',
        'on-surface-variant': '#374151',

        // Status Indicators
        'fresh-mint': '#10B981',
        'warning-mint': '#F59E0B',
        'critical-red': '#EF4444',

        // Shadcn UI Compatibility Tokens
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'tactile': '0 4px 0 0 #3a8a36',
        'tactile-pressed': '0 0px 0 0 #3a8a36',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
