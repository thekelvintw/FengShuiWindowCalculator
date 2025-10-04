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
    <div className="flex flex-col h-full">
      <header className="text-center">
        {user && (
          <button onClick={onShowProfile} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800" aria-label="個人檔案">
            <UserCircleIcon className="w-8 h-8" />
          </button>
        )}
        <h1 className="h-title">九運開窗簡易測算</h1>
        <p className="h-subtitle">別開錯了！你家旺氣，藏在這扇窗！選定客廳/臥房，由 App 精算吉位。</p>
      </header>
      
      <section className="mt-8 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="app-card p-6 hover:shadow-md transition text-center"
                  onClick={() => onStart('sitting')}>
            <div className="text-blue-600 mb-2 text-3xl">👤</div>
            <div className="font-semibold">坐著</div>
          </button>
          <button className="app-card p-6 hover:shadow-md transition text-center"
                  onClick={() => onStart('lying')}>
            <div className="text-blue-600 mb-2 text-3xl">🛏️</div>
            <div className="font-semibold">躺在床上</div>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 screen-only">
          {hasRecords && (
            <button className="btn-secondary" onClick={onShowList}>查看已保存記錄</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
