import React from 'react';
import { AppMode } from '../types';
import { UserIcon, BedIcon, UserCircleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';

interface HomePageProps {
  onStart: (mode: AppMode) => void;
  onShowList: () => void;
  onShowProfile: () => void;
  hasRecords: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onShowList, onShowProfile, hasRecords }) => {
  const { user } = useAuth();
  
  return (
    <Layout>
      {/* Hero 區 */}
      <section className="mb-10 sm:mb-12">
        <h1 className="hero-title">九運開窗簡易測算</h1>
        <p className="hero-subtitle">
          別開錯了！你家旺氣，藏在這扇窗！<br className="hidden sm:block"/>
          【步驟】選定客廳/臥房，由 App 精算吉位。
        </p>
      </section>

      {/* 請選擇動作 */}
      <section className="text-center mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg text-gray-700">開始測第一扇門窗</h2>
      </section>

      {/* 兩顆卡片 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        <button
          className="ui-card p-6 sm:p-7 lg:p-8 flex flex-col items-center justify-center text-center select-none hover:shadow-lg transition-shadow"
          onClick={() => onStart('sitting')}
        >
          <div className="mb-3">
            <UserIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="text-lg sm:text-xl font-semibold text-gray-900">坐著</div>
        </button>

        <button
          className="ui-card p-6 sm:p-7 lg:p-8 flex flex-col items-center justify-center text-center select-none hover:shadow-lg transition-shadow"
          onClick={() => onStart('lying')}
        >
          <div className="mb-3">
            <BedIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="text-lg sm:text-xl font-semibold text-gray-900">躺在床上</div>
        </button>
      </section>

      {/* 「查看已保存記錄」 */}
      {hasRecords && (
        <div className="mt-10 sm:mt-12 text-center">
          <button 
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 underline-offset-4 hover:underline"
            onClick={onShowList}
          >
            查看已保存記錄
          </button>
        </div>
      )}

      {/* 用戶頭像 */}
      {user && (
        <div className="mt-6 text-center">
          <button 
            onClick={onShowProfile} 
            className="p-2 text-gray-500 hover:text-gray-800" 
            aria-label="個人檔案"
          >
            <UserCircleIcon className="w-8 h-8" />
          </button>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
