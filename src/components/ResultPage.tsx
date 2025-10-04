import React, { useState } from 'react';
import { FortuneResult, AppMode } from '../types';
import Layout from './Layout';
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
    <Layout title="分析結果">
      <div className="ui-card p-5 sm:p-6 lg:p-8">
        <div className="text-sm text-gray-500 mb-2">{result.abs_deg}° · {result.direction} · {result.gua}位</div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{result.fortune_status}</h3>
        <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">{result.copy}</p>

        {!user && reachGuestLimit() && (
            <div className="text-center mb-6 text-sm text-gray-500">
                <p>想把結果帶著走？ <button onClick={handleLoginClick} className="text-indigo-600 underline hover:text-indigo-800">用 Google 登入</button> 就能跨裝置同步。</p>
            </div>
        )}

        {/* 底部按鈕列 */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onClick={onRetest}>
            返回首頁
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => setShowSaveModal(true)}>
            {isEditing ? '更新' : '保存'}
          </button>
        </div>
      </div>
      
      {showSaveModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
            <div className="ui-card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-2">保存記錄</h3>
                <p className="text-sm text-gray-600 mb-4">可輸入空間名稱_哪扇窗</p>
                <input
                    type="text"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    placeholder="例如：客廳_落地窗"
                    className="w-full p-2 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onClick={() => setShowSaveModal(false)}>取消</button>
                    <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleConfirmSave}>{isEditing ? '確認更新' : '確認保存'}</button>
                </div>
            </div>
        </div>
      )}
    </Layout>
  );
};

export default ResultPage;
