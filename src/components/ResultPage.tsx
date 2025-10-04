import React, { useState } from 'react';
import { FortuneResult, AppMode } from '../types';
import PageShell from './PageShell';
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
    <PageShell
      title="分析結果"
      subtitle={`${result.abs_deg}° · ${result.direction} · ${result.gua}位`}
      rightSlot={<button className="btn btn-secondary px-3 h-9" onClick={onBack}>🏠 首頁</button>}
    >
      {/* 結果卡片 */}
      <section className="card p-5 sm:p-6">
        <div className="text-sm text-slate-500">{result.abs_deg}° · {result.direction} · {result.gua}位</div>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{result.fortune_status}</h3>
        <p className="mt-2 text-slate-700 leading-relaxed text-base sm:text-lg">{result.copy}</p>

        {!user && reachGuestLimit() && (
            <div className="text-center mt-3 mb-3 text-sm text-slate-500">
                <p>想把結果帶著走？ <button onClick={handleLoginClick} className="text-brand-600 underline hover:text-brand-800">用 Google 登入</button> 就能跨裝置同步。</p>
            </div>
        )}
      </section>

      {/* 底部主動作 */}
      <div className="action-bar mt-6">
        <div className="action-bar-inner">
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-secondary h-12" onClick={onRetest}>返回首頁</button>
            <button className="btn btn-primary h-12" onClick={() => setShowSaveModal(true)}>{isEditing ? '更新' : '保存'}</button>
          </div>
        </div>
      </div>
      
      {showSaveModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
            <div className="card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-2">保存記錄</h3>
                <p className="text-sm text-slate-600 mb-4">可輸入空間名稱_哪扇窗</p>
                <input
                    type="text"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    placeholder="例如：客廳_落地窗"
                    className="w-full p-2 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                />
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>取消</button>
                    <button className="btn btn-primary" onClick={handleConfirmSave}>{isEditing ? '確認更新' : '確認保存'}</button>
                </div>
            </div>
        </div>
      )}
    </PageShell>
  );
};

export default ResultPage;
