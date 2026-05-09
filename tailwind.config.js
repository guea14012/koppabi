/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        k: { bg:'#07070f', surface:'#0d0d1a', card:'#111120', border:'#1e1e38', hover:'#1a1a30', text:'#e0e4ff', muted:'#6b7ab5', dim:'#3a4070' },
        accent: { DEFAULT:'#ff8800', soft:'rgba(255,136,0,.15)', border:'rgba(255,136,0,.35)' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], display:['Space Grotesk','Inter','sans-serif'], mono:['JetBrains Mono','monospace'] },
    },
  },
  plugins: [],
}
