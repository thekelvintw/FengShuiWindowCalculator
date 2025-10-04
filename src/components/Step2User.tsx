import React, { useState } from 'react';
import RotaryDial from './RotaryDial';
import { PageHeader, ActionButton } from './common';
import { CheckIcon, UserIcon, BedIcon } from './icons';
import { AppMode } from '../types';

interface Step2UserProps {
  mode: AppMode;
  northDeg: number;
  onComplete: (user: number) => void;
  onBack: () => void;
  onHome: () => void;
}

const Step2User: React.FC<Step2UserProps> = ({ mode, northDeg, onComplete, onBack, onHome }) => {
  const [userDeg, setUserDeg] = useState(0);

  const title = "我的朝向 (S2)";
  const description = mode === 'sitting' 
    ? '將圖示轉到您坐下後主要看的方向 (例如電視牆)。'
    : '將圖示轉到您躺下時頭部朝向的方向。';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <PageHeader title={title} step="步驟 2/3" onBack={onBack} onHome={onHome} />
      <main className="flex-grow overflow-y-auto flex flex-col items-center justify-center p-4 text-center">
        <p className="max-w-xs mb-8 text-gray-600">{description}</p>
        <RotaryDial onRotationChange={setUserDeg} snapDegrees={5} northIndicatorDeg={northDeg}>
          <div className="flex flex-col items-center text-blue-600">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-blue-600 -mb-1"></div>
            {mode === 'sitting' ? <UserIcon className="w-16 h-16" /> : <BedIcon className="w-16 h-16" />}
          </div>
        </RotaryDial>
      </main>
      <footer className="p-4 border-t border-gray-200 bg-white">
        <ActionButton onClick={() => onComplete(userDeg)} icon={<CheckIcon className="w-6 h-6"/>}>
          下一步
        </ActionButton>
      </footer>
    </div>
  );
};

export default Step2User;