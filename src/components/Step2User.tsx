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
    <section className="dial-card">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>

      <div className="mt-8 flex flex-col items-center">
        <RotaryDial onRotationChange={setUserDeg} snapDegrees={5} northIndicatorDeg={northDeg}>
          <div className="flex flex-col items-center text-blue-600">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-blue-600 -mb-1"></div>
            {mode === 'sitting' ? <UserIcon className="w-16 h-16" /> : <BedIcon className="w-16 h-16" />}
          </div>
        </RotaryDial>
      </div>

      <div className="mt-10 flex gap-3 justify-end">
        <button className="btn-secondary" onClick={onBack}>上一步</button>
        <button className="btn-primary" onClick={() => onComplete(userDeg)}>下一步</button>
      </div>
    </section>
  );
};

export default Step2User;