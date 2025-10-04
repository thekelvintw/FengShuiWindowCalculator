import React from 'react';
import { AppMode } from '../types';
import { UserIcon, BedIcon, UserCircleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onStart: (mode: AppMode) => void;
  onShowList: () => void;
  onShowProfile: () => void;
  hasRecords: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onShowList, onShowProfile, hasRecords }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 text-center justify-between overflow-y-auto">
      <header className="relative">
         {user && (
          <button onClick={onShowProfile} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-800" aria-label="個人檔案">
            <UserCircleIcon className="w-8 h-8" />
          </button>
        )}
        <div className="pt-12">
            <h1 className="text-3xl font-bold text-gray-900">九運開窗簡易測算</h1>
            <p className="text-xl font-semibold text-blue-500 mt-4">別開錯了！你家旺氣，藏在這扇窗！</p>
            <div className="text-gray-600 mt-6 text-center max-w-sm mx-auto space-y-2 text-base">
                <p>【步驟】選定客廳/臥房，App精算吉位。</p>
                <p>用最簡單的方法，調整家中氣感節奏。</p>
            </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center space-y-6">
        <p className="text-lg font-semibold text-gray-700">開始測第一扇門窗</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
          <button
            onClick={() => onStart('sitting')}
            className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            <UserIcon className="w-12 h-12 text-blue-500 mb-3 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-gray-700">坐著</span>
          </button>
          <button
            onClick={() => onStart('lying')}
            className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            <BedIcon className="w-12 h-12 text-blue-500 mb-3 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-gray-700">躺在床上</span>
          </button>
        </div>
      </main>

      <footer className="mt-12">
        {hasRecords && (
          <button 
            onClick={onShowList}
            className="text-gray-500 hover:text-gray-800 font-semibold transition-colors"
          >
            查看已保存記錄
          </button>
        )}
      </footer>
    </div>
  );
};

export default HomePage;
