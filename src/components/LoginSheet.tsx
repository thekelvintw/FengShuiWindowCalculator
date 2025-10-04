import React from 'react';
import { GoogleIcon } from './icons';

interface LoginSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginSheet: React.FC<LoginSheetProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 bg-black/50 z-40 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-2xl transform transition-transform duration-300 translate-y-0"
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">保留你的測試歷史</h2>
          <p className="text-gray-600 mt-2">登入後即可同步、備份、快速重測</p>

          <ul className="text-left space-y-3 my-6">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span> 跨裝置同步你的測量結果
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span> 不會收到任何廣告或促銷信
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span> 可隨時匯出或刪除所有資料
            </li>
          </ul>

          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon className="w-6 h-6 mr-3" />
            <span className="font-semibold text-gray-700">以 Google 登入</span>
          </button>

          <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
            先不需要
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSheet;
