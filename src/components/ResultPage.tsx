import React, { useState } from 'react';
import { FortuneResult, AppMode } from '../types';
import { ActionButton } from './common';
import { ChevronLeftIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { reachGuestLimit } from '../services/store';

interface ResultPageProps {
  result: FortuneResult;
  mode: AppMode;
  onSave: (roomName: string) => void;
  onRetest: () => void;
  onBack: () => void;
  onLoginPrompt: () => void;
  initialRoomName: string;
  isEditing: boolean;
}

const ResultCard: React.FC<{ result: FortuneResult; mode: AppMode }> = ({ result, mode }) => {
  const statusColors = {
    '氣吉': 'bg-green-100 text-green-800 border-green-400',
    '氣偏悶': 'bg-gray-100 text-gray-800 border-gray-300',
    '邊界保守': 'bg-yellow-100 text-yellow-800 border-yellow-400',
  };

  return (
    <div className={`p-6 rounded-lg border-2 shadow-lg ${statusColors[result.fortune_status]}`}>
      <div className="flex justify-between items-baseline">
        <p className="text-sm font-semibold opacity-80">{result.abs_deg}° · {result.direction} · {result.gua}位</p>
        <span className="text-xs font-medium bg-white/60 px-2 py-1 rounded-full">{mode === 'sitting' ? '坐著' : '躺在床上'}</span>
      </div>
      <h2 className="text-4xl font-bold my-3">{result.fortune_status}</h2>
      <p className="text-base leading-relaxed">{result.copy}</p>
    </div>
  );
};


const ResultPage: React.FC<ResultPageProps> = ({ result, mode, onSave, onRetest, onBack, onLoginPrompt, initialRoomName, isEditing }) => {
    const { user, login } = useAuth();
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [roomName, setRoomName] = useState(initialRoomName);

    const handleConfirmSave = () => {
        onSave(roomName);
        setShowSaveModal(false);
    }

    const handleLoginClick = async () => {
        await login();
    }
  
    return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="relative flex items-center justify-center p-4 border-b border-gray-200">
        <button onClick={onBack} className="absolute left-4 p-2 text-gray-500 hover:text-gray-800" aria-label="Back to previous step">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 text-center">分析結果</h2>
      </header>
      <main className="flex-grow overflow-y-auto p-6 flex flex-col justify-center">
        <ResultCard result={result} mode={mode} />
        {!user && reachGuestLimit() && (
            <div className="text-center mt-3 mb-3 text-sm text-gray-500">
                <p>想把結果帶著走？ <button onClick={handleLoginClick} className="text-blue-600 underline hover:text-blue-800">用 Google 登入</button> 就能跨裝置同步。</p>
            </div>
        )}
      </main>
      <footer className="p-4 border-t border-gray-200 bg-white grid grid-cols-2 gap-4">
        <ActionButton onClick={onRetest} variant="secondary">返回首頁</ActionButton>
        <ActionButton onClick={() => setShowSaveModal(true)}>{isEditing ? '更新' : '保存'}</ActionButton>
      </footer>
      
      {showSaveModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-2">保存記錄</h3>
                <p className="text-sm text-gray-600 mb-4">可輸入空間名稱_哪扇窗</p>
                <input
                    type="text"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    placeholder="例如：客廳_落地窗"
                    className="w-full p-2 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <ActionButton variant="secondary" onClick={() => setShowSaveModal(false)}>取消</ActionButton>
                    <ActionButton onClick={handleConfirmSave}>{isEditing ? '確認更新' : '確認保存'}</ActionButton>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
