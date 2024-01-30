import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            colors: {
                brand: {
                    green: {
                        50: '#E4F3F1',
                        100: '#AFDAD5',
                        200: '#7AC2B9',
                        300: '#5FB6AB',
                        400: '#2A9D8F',
                        success: '#4BB543'
                    },

                    blue: {
                        50: '#9ac4eb',
                        100: '#415D69',
                        200: '#264653'
                    },

                    yellow: {
                        600: '#e9c46a',

                        650: '#f4a261'
                    },

                    orange: {
                        700: '#F0A592',
                        750: '#ED937D',
                        800: '#e76f51'
                    },

                    black: {
                        100: '#2B2933'
                    }
                }
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
} satisfies Config;

export default config;
