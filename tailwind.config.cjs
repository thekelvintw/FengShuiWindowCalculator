/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.html"
  ],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { DEFAULT: "#2563eb", soft: "#eaf2ff" },
      },
      boxShadow: {
        card: "0 6px 18px rgba(16,24,40,.08)",
      },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  safelist: [
    { pattern: /(bg|text|border)-(gray|neutral|blue)-(100|200|300|400|500|600|700)/ },
    { pattern: /(grid-cols|gap)-(1|2|3|4|6|8)/ },
    { pattern: /^rotate-\[(.*)\]$/ },
    'print:bg-white','print:text-black','print:shadow-none','print:border-0',
    { pattern: /(text)-(xs|sm|base|lg|xl|2xl|3xl|4xl)/ },
    { pattern: /(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-(0|1|2|3|4|5|6|8|10)/ }
  ],
};