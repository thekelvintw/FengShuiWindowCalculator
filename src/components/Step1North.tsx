
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
    <section className="dial-card">
      <h2 className="text-xl font-bold text-gray-900">校準北方 (S1)</h2>
      <p className="mt-2 text-gray-600">找最有把握的牆當基準，把 N 轉到你心中的北；量不準也行，我們以保守策略處理。</p>

      <div className="mt-8 flex flex-col items-center">
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
      </div>

      <div className="mt-10 flex gap-3 justify-end">
        <button className="btn-secondary" onClick={onBack}>上一步</button>
        <button className="btn-primary" onClick={() => onComplete(northDeg)}>下一步</button>
      </div>
    </section>
  );
};

export default Step1North;