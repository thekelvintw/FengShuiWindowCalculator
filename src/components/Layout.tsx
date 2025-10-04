import React from 'react';

type Props = { title?: string; children: React.ReactNode };

export default function Layout({ title, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="container-app py-3">
          <nav className="flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold text-gray-900">
              九運開窗簡易測算
            </div>
            {/* 如有其它 nav 動作或登入按鈕放右邊 */}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="container-app py-8 sm:py-10 lg:py-12">
          {title ? (
            <h1 className="hero-title">{title}</h1>
          ) : null}
          {children}
        </div>
      </main>

      {/* Footer（可有可無） */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container-app py-6 text-sm text-gray-500">
          © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
