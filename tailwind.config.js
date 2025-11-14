/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Color tokens from design system
      colors: {
        // Brand colors
        brand: {
          indigo: '#6366F1',
          pink: '#EC4899',
          orange: '#F97316',
        },
        // Text colors
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          inverse: '#FFFFFF',
          accent: '#1F2937',
        },
        // Border colors
        border: {
          subtle: '#E5E5EA',
          muted: '#D1D5DB',
          strong: '#9CA3AF',
        },
        // Content/Surface colors
        content: {
          surface: '#FFFFFF',
          subtle: '#F5F5F7',
        },
        canvas: {
          muted: '#E3E7EC',
        },
        // Action colors
        action: {
          'primary-bg': '#111827',
          'primary-bg-hover': '#030712',
          'primary-text': '#FFFFFF',
          'secondary-bg': '#F3F4F6',
          'secondary-bg-hover': '#E5E7EB',
          'secondary-text': '#111827',
        },
        // State colors
        success: {
          bg: '#DCFCE7',
          text: '#166534',
        },
        warning: {
          bg: '#FEF3C7',
          text: '#92400E',
        },
        error: {
          bg: '#FEE2E2',
          text: '#B91C1C',
        },
        info: {
          bg: '#DBEAFE',
          text: '#1D4ED8',
        },
      },
      // Background gradients
      backgroundImage: {
        'app-gradient': 'linear-gradient(135deg, #FFEBD6 0%, #FDE3F2 50%, #E4E5FF 100%)',
        'brand-gradient': 'linear-gradient(90deg, #6366F1 0%, #EC4899 50%, #F97316 100%)',
      },
      // Typography
      fontSize: {
        display: ['72px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        h1: ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        subtitle: ['20px', { lineHeight: '1.5', letterSpacing: '-0.005em', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-strong': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '600' }],
        caption: ['13px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        overline: ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      // Font families
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace'],
      },
      // Spacing (semantic tokens)
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '64px',
      },
      // Border radius
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },
      // Shadows
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        lg: '0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
      },
      // Animation durations
      transitionDuration: {
        fast: '150ms',
        normal: '220ms',
        slow: '320ms',
      },
      // Easing functions
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
      },
      // Backdrop blur
      backdropBlur: {
        soft: '20px',
      },
      // Animations
      keyframes: {
        'spring-enter': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '50%': { transform: 'scale(1.01) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'spring-enter': 'spring-enter 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 220ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        'fade-in-up': 'fade-in-up 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-in': 'bounce-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
