
import React from 'react';
import { ActionButton } from './common';
import { CheckIcon, ArrowUturnLeftIcon } from './icons';

interface PostSavePageProps {
  onMeasureNext: () => void;
  onGoHome: () => void;
}

const PostSavePage: React.FC<PostSavePageProps> = ({ onMeasureNext, onGoHome }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center p-6 bg-gray-50">
      <div className="bg-blue-500 rounded-full p-4 mb-6">
        <CheckIcon className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">記錄已保存！</h2>
      <p className="text-gray-600 mb-12">接下來您想做什麼？</p>
      
      <div className="w-full max-w-xs space-y-4">
        <ActionButton onClick={onMeasureNext}>
          測下一扇窗
        </ActionButton>
        <ActionButton onClick={onGoHome} variant="secondary">
          <ArrowUturnLeftIcon className="w-5 h-5 mr-2"/>
          返回首頁
        </ActionButton>
      </div>
    </div>
  );
};

export default PostSavePage;