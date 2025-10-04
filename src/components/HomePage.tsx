import React from 'react';
import { AppMode } from '../types';
import { UserIcon, BedIcon, UserCircleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import PageShell from './PageShell';

interface HomePageProps {
  onStart: (mode: AppMode) => void;
  onShowList: () => void;
  onShowProfile: () => void;
  hasRecords: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onShowList, onShowProfile, hasRecords }) => {
  const { user } = useAuth();
  
  return (
    <PageShell
      title="九運開窗簡易測算"
      subtitle={
        <>
          別開錯了！你家旺氣，藏在這扇窗！<br className="hidden sm:block" />
          【步驟】選定客廳/臥房，由 App 精算吉位。
        </>
      }
      rightSlot={
        hasRecords ? (
          <button className="btn btn-secondary px-4 h-10" onClick={onShowList}>查看已保存記錄</button>
        ) : user ? (
          <button onClick={onShowProfile} className="p-2 text-gray-500 hover:text-gray-800" aria-label="個人檔案">
            <UserCircleIcon className="w-8 h-8" />
          </button>
        ) : null
      }
    >
      <section className="text-center space-y-8 sm:space-y-10">
        <h2 className="text-slate-600">開始測第一扇門窗</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <button className="option-card" onClick={() => onStart('sitting')}>
            <UserIcon className="w-9 h-9 text-brand-600" />
            <span className="option-label">坐著</span>
          </button>

          <button className="option-card" onClick={() => onStart('lying')}>
            <BedIcon className="w-9 h-9 text-brand-600" />
            <span className="option-label">躺在床上</span>
          </button>
        </div>
      </section>
    </PageShell>
  );
};

export default HomePage;
