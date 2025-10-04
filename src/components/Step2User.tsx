import React, { useState } from 'react';
import RotaryDial from './RotaryDial';
import PageShell from './PageShell';
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
    <PageShell
      title={title}
      subtitle={description}
      rightSlot={<button className="btn btn-secondary px-3 h-9" onClick={onHome}>🏠 首頁</button>}
    >
      {/* 內容卡片 */}
      <section className="card p-5 sm:p-6">
        {/* 錶盤容器：始終正方比例、置中 */}
        <div className="dial-wrap">
          <RotaryDial onRotationChange={setUserDeg} snapDegrees={5} northIndicatorDeg={northDeg}>
            <div className="flex flex-col items-center text-brand-600">
              <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-brand-600 -mb-1"></div>
              {mode === 'sitting' ? <UserIcon className="w-16 h-16" /> : <BedIcon className="w-16 h-16" />}
            </div>
          </RotaryDial>
        </div>

        {/* 角度讀數 */}
        <div className="mt-5 text-center text-slate-600">{userDeg}°</div>
      </section>

      {/* 底部主動作 */}
      <div className="action-bar mt-6">
        <div className="action-bar-inner">
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-secondary h-12" onClick={onBack}>上一步</button>
            <button className="btn btn-primary h-12" onClick={() => onComplete(userDeg)}>下一步</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Step2User;