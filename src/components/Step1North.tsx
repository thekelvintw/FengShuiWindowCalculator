
import React, { useState } from 'react';
import RotaryDial from './RotaryDial';
import { PageHeader, ActionButton } from './common';
import { CheckIcon } from './icons';

interface Step1NorthProps {
  onComplete: (north: number) => void;
  onBack: () => void;
}

const Step1North: React.FC<Step1NorthProps> = ({ onComplete, onBack }) => {
  const [northDeg, setNorthDeg] = useState(0);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <PageHeader title="校準北方 (S1)" step="步驟 1/3" onBack={onBack} />
      <main className="flex-grow overflow-y-auto flex flex-col items-center justify-center p-4 text-center">
        <p className="max-w-xs mb-8 text-gray-600">
          找最有把握的牆當基準，把 N 轉到你心中的北；量不準也行，我們以保守策略處理。
        </p>
        <RotaryDial onRotationChange={setNorthDeg} snapDegrees={1}>
            <div className="relative w-full h-full">
                {/* North Pointer - Red, thicker, with 'N' at the tip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center">
                    <div className="w-0 h-0
                        border-l-8 border-l-transparent
                        border-r-8 border-r-transparent
                        border-b-12 border-b-red-600"
                        aria-hidden="true">
                    </div>
                    <div className="w-3 bg-red-600 flex-grow" aria-hidden="true"></div>
                    <span className="absolute top-6 font-black text-white text-base pointer-events-none">N</span>
                </div>
                
                {/* South Pointer - Thinner gray line with 'S' at the tip */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col-reverse items-center">
                    <div className="w-1 bg-gray-400 flex-grow" aria-hidden="true"></div>
                     <span className="absolute bottom-6 font-semibold text-gray-600 text-base pointer-events-none">S</span>
                </div>

                {/* Center Pivot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full border-2 border-white z-10" aria-hidden="true"></div>
            </div>
        </RotaryDial>
      </main>
      <footer className="p-4 border-t border-gray-200 bg-white">
        <ActionButton onClick={() => onComplete(northDeg)} icon={<CheckIcon className="w-6 h-6"/>}>
          下一步
        </ActionButton>
      </footer>
    </div>
  );
};

export default Step1North;