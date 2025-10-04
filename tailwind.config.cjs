/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 如無此字體，退回 system-ui；可保留或移除
        sans: ['"Noto Sans TC"', 'system-ui', 'ui-sans-serif', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      maxWidth: {
        'screen-2md': '56rem', // 896px 介於 md 與 lg 中間，符合你畫面比例
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
  // 若有 runtime 生成的類別（例如 text-red-500 之類動態組合），請 safelist
  safelist: [
    // 'text-emerald-600',
    // 'ring-2', 'ring-indigo-500', ...
  ],
}