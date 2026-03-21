/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary (Orange) — synced with Figma design system
        'primary': {
          light: '#fdede9',
          muted: '#f07654',
          DEFAULT: '#f03d01',
          dark: '#c23001',
        },
        // Neutral
        'neutral': {
          lightest: '#f5f5f5',
          light: '#e5e5e5',
          muted: '#7a7a7a',
          DEFAULT: '#4a4a4a',
          dark: '#1b1b1b',
        },
        // Secondary (Blue-Gray)
        'secondary': {
          light: '#f4f6f7',
          muted: '#d6dce4',
          DEFAULT: '#8f9daf',
          dark: '#5e6c7c',
        },
      },
      fontFamily: {
        'heading': ['Hubot Sans', 'Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Menlo', 'source-code-pro', 'Monaco', 'monospace'],
      },
      fontSize: {
        'h1': ['38px', { lineHeight: '45.6px' }],
        'h2': ['34px', { lineHeight: '40.8px' }],
        'h3': ['30px', { lineHeight: '36px' }],
        'h4': ['26px', { lineHeight: '31.2px' }],
        'h5': ['22px', { lineHeight: '26.4px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '25.6px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px' }],
      },
      fontWeight: {
        'extrabold': '800',
      },
      borderRadius: {
        'btn': '10px',
        'card': '12px',
        'card-lg': '16px',
      },
      spacing: {
        '18': '4.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
