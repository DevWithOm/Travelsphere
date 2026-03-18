/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                vintage: {
                    paper: 'rgb(var(--vintage-paper) / <alpha-value>)',
                    ink: 'rgb(var(--vintage-ink) / <alpha-value>)',
                    leather: 'rgb(var(--vintage-leather) / <alpha-value>)',
                    brass: 'rgb(var(--vintage-brass) / <alpha-value>)',
                    accent: 'rgb(var(--vintage-accent) / <alpha-value>)',
                    sky: 'rgb(var(--vintage-sky) / <alpha-value>)',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
                mono: ['"Courier Prime"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            backgroundImage: {
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            }
        },
    },
    plugins: [],
}
