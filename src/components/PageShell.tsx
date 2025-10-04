import React from 'react';

type Props = {
  title?: string;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode; // 放「查看已保存記錄」或登入鈕
  children: React.ReactNode;
};

export default function PageShell({ title, subtitle, rightSlot, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="container-app py-3 flex items-center justify-between">
          <div>
            {title && <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>}
            {subtitle && <div className="text-gray-500 text-sm sm:text-base mt-0.5">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2">{rightSlot}</div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container-app py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
