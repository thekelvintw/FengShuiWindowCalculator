import React, { useState } from 'react';
import RotaryDial from './RotaryDial';
import Layout from './Layout';
import { UserIcon, BedIcon } from './icons';
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
    <Layout title={title}>
      <div className="ui-card p-5 sm:p-6 lg:p-8">
        <p className="text-gray-700 mb-4">{description}</p>

        {/* 錶盤容器 */}
        <div className="flex justify-center my-8">
          <div className="w-full max-w-md aspect-square">
            <RotaryDial onRotationChange={setUserDeg} snapDegrees={5} northIndicatorDeg={northDeg}>
              <div className="flex flex-col items-center text-indigo-600">
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-indigo-600 -mb-1"></div>
                {mode === 'sitting' ? <UserIcon className="w-16 h-16" /> : <BedIcon className="w-16 h-16" />}
              </div>
            </RotaryDial>
          </div>
        </div>

        {/* 角度讀數 */}
        <div className="text-center text-gray-600 mb-6">{userDeg}°</div>

        {/* 底部按鈕列 */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50" onClick={onBack}>
            上一步
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => onComplete(userDeg)}>
            下一步
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Step2User;