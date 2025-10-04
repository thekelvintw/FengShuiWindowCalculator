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
    <section className="result-card">
      <div className="text-sm text-gray-500">{result.abs_deg}° · {result.direction} · {result.gua}位</div>
      <h3 className="mt-2 text-2xl font-extrabold text-gray-900">{result.fortune_status}</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">{result.copy}</p>

      {!user && reachGuestLimit() && (
          <div className="text-center mt-3 mb-3 text-sm text-gray-500">
              <p>想把結果帶著走？ <button onClick={handleLoginClick} className="text-blue-600 underline hover:text-blue-800">用 Google 登入</button> 就能跨裝置同步。</p>
          </div>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onRetest}>返回首頁</button>
        <button className="btn-primary" onClick={() => setShowSaveModal(true)}>{isEditing ? '更新' : '保存'}</button>
      </div>
      
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
                    <button className="btn-secondary" onClick={() => setShowSaveModal(false)}>取消</button>
                    <button className="btn-primary" onClick={handleConfirmSave}>{isEditing ? '確認更新' : '確認保存'}</button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default ResultPage;
