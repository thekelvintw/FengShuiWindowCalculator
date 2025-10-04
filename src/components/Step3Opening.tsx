
import React, { useState } from 'react';
import PageShell from './PageShell';
import { CalculationState } from '../types';

interface Step3OpeningProps {
  onCalculate: (relativeDeg: number | null, absoluteDeg: number | null) => void;
  onBack: () => void;
  onHome: () => void;
  initialState: CalculationState;
}

const quickDirections = [
  { label: '前左', deg: -45 }, { label: '前', deg: 0 }, { label: '前右', deg: 45 },
  { label: '左', deg: -90 }, { label: '', deg: null }, { label: '右', deg: 90 },
  { label: '後左', deg: -135 }, { label: '後', deg: 180 }, { label: '後右', deg: 135 },
];

const Step3Opening: React.FC<Step3OpeningProps> = ({ onCalculate, onBack, onHome, initialState }) => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [relativeDeg, setRelativeDeg] = useState<number>(initialState.relativeDeg ?? 0);
  const [absoluteDeg, setAbsoluteDeg] = useState<number | null>(initialState.absoluteDeg ?? null);
  const [inputType, setInputType] = useState<'relative' | 'absolute'>(initialState.absoluteDeg !== null ? 'absolute' : 'relative');

  const handleQuickSelect = (deg: number | null) => {
    if (deg !== null) {
      onCalculate(deg, null);
    }
  };

  const handleAdvancedSubmit = () => {
    if (inputType === 'relative') {
        onCalculate(relativeDeg, null);
    } else {
        onCalculate(null, absoluteDeg ?? 0);
    }
  }

  return (
    <PageShell
      title="開口相對位置 (S3)"
      subtitle="這扇「開口」相對我在哪？點擊下方按鈕選擇方位"
      rightSlot={<button className="btn btn-secondary px-3 h-9" onClick={onHome}>🏠 首頁</button>}
    >
      {/* 內容卡片 */}
      <section className="card p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          {quickDirections.map(({ label, deg }) => (
            <button key={label || 'center'} 
                    disabled={deg === null}
                    onClick={() => handleQuickSelect(deg)}
                    className={`card h-16 flex items-center justify-center text-gray-800 hover:shadow-md transition ${deg === null ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {deg === null ? <div className="w-8 h-8 rounded-full bg-gray-300"></div> : label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold text-gray-800">展開進階選項</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex justify-center mb-4">
                <button onClick={() => setInputType('relative')} className={`px-4 py-2 text-sm rounded-l-md ${inputType === 'relative' ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>相對角度</button>
                <button onClick={() => setInputType('absolute')} className={`px-4 py-2 text-sm rounded-r-md ${inputType === 'absolute' ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>絕對角度</button>
              </div>
              
              {inputType === 'relative' ? (
                  <div>
                      <label className="block text-sm font-medium text-gray-700">相對我的角度 (前=0°)</label>
                      <input type="number" value={relativeDeg} onChange={e => setRelativeDeg(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full text-center text-2xl font-bold p-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"/>
                  </div>
              ) : (
                  <div>
                      <label className="block text-sm font-medium text-gray-700">絕對方位角度 (北=0°)</label>
                      <input type="number" value={absoluteDeg ?? ''} onChange={e => setAbsoluteDeg(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full text-center text-2xl font-bold p-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"/>
                  </div>
              )}
               <button className="btn btn-primary mt-4" onClick={handleAdvancedSubmit}>
                  查看結果
              </button>
            </div>
          </details>
        </div>
      </section>

      {/* 底部主動作 */}
      <div className="action-bar mt-6">
        <div className="action-bar-inner">
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-secondary h-12" onClick={onBack}>上一步</button>
            <button className="btn btn-primary h-12" onClick={() => onCalculate(0, null)}>查看結果</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Step3Opening;