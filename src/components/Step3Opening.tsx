
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
    <div className="flex flex-col h-full bg-gray-50">
      <PageHeader title="開口相對位置 (S3)" step="步驟 3/3" onBack={onBack} onHome={onHome} />
      <main className="flex-grow overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">這扇「開口」相對我在哪？</h3>
        <p className="text-gray-600 mb-6">點擊下方按鈕選擇方位</p>
        
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {quickDirections.map(({ label, deg }) => (
            <button
              key={label || 'center'}
              disabled={deg === null}
              onClick={() => handleQuickSelect(deg)}
              className={`py-4 px-2 rounded-lg text-lg font-semibold transition-colors border ${
                deg !== null
                  ? 'bg-white shadow-sm hover:bg-blue-50 border-gray-200'
                  : 'bg-transparent border-transparent flex items-center justify-center'
              }`}
            >
              {deg === null ? <div className="w-8 h-8 rounded-full bg-gray-300"></div> : label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-xs mt-8">
            <button onClick={() => setIsAdvanced(!isAdvanced)} className="text-blue-600 font-semibold">
                {isAdvanced ? '收起進階選項' : '展開進階選項'}
            </button>
        </div>

        {isAdvanced && (
          <div className="w-full max-w-xs mt-4 p-4 bg-white rounded-lg shadow-md">
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
             <ActionButton onClick={handleAdvancedSubmit} className="mt-4 !py-2 !text-base">
                查看結果
            </ActionButton>
          </div>
        )}
      </main>
      <footer className="p-4 border-t border-gray-200 bg-white">
        <p className="text-center text-sm text-gray-500">或使用進階選項手動輸入角度</p>
      </footer>
    </div>
  );
};

export default Step3Opening;