
import React, { useState } from 'react';
import { PageHeader, ActionButton } from './common';
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
    <section className="dial-card">
      <h2 className="text-xl font-bold">開口相對位置 (S3)</h2>
      <p className="mt-2 text-gray-600">這扇「開口」相對我在哪？點擊下方按鈕選擇方位</p>

      <div className="choice-grid">
        {quickDirections.map(({ label, deg }) => (
          <button key={label || 'center'} 
                  disabled={deg === null}
                  onClick={() => handleQuickSelect(deg)}
                  className={`choice-card ${deg === null ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {deg === null ? <div className="w-8 h-8 rounded-full bg-gray-300"></div> : label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <details className="app-card p-4">
          <summary className="cursor-pointer font-semibold text-gray-800">展開進階選項</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex justify-center mb-4">
              <button onClick={() => setInputType('relative')} className={`px-4 py-2 text-sm rounded-l-md ${inputType === 'relative' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>相對角度</button>
              <button onClick={() => setInputType('absolute')} className={`px-4 py-2 text-sm rounded-r-md ${inputType === 'absolute' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>絕對角度</button>
            </div>
            
            {inputType === 'relative' ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700">相對我的角度 (前=0°)</label>
                    <input type="number" value={relativeDeg} onChange={e => setRelativeDeg(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full text-center text-2xl font-bold p-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700">絕對方位角度 (北=0°)</label>
                    <input type="number" value={absoluteDeg ?? ''} onChange={e => setAbsoluteDeg(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full text-center text-2xl font-bold p-2 bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            )}
             <button className="btn-primary mt-4" onClick={handleAdvancedSubmit}>
                查看結果
            </button>
          </div>
        </details>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onBack}>上一步</button>
        <button className="btn-primary" onClick={() => onCalculate(0, null)}>查看結果</button>
      </div>
    </section>
  );
};

export default Step3Opening;