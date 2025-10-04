import React from 'react';
import { SavedRecord } from '../types';
import { ActionButton } from './common';
import { ArrowUturnLeftIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { MAX_GUEST_RECORDS } from '../constants';
import NotificationCapsule from './NotificationCapsule';

interface ListPageProps {
  records: SavedRecord[];
  onRetest: (record: SavedRecord) => void;
  onDelete: (id: string) => void;
  onHome: () => void;
  onLoginPrompt: () => void;
}

const getStatusColorClasses = (status: SavedRecord['fortune_status']) => {
  switch (status) {
    case '氣吉': return 'border-l-green-500';
    case '氣偏悶': return 'border-l-gray-500';
    case '邊界保守': return 'border-l-yellow-500';
    default: return 'border-l-gray-300';
  }
};

const ListPage: React.FC<ListPageProps> = ({ records, onRetest, onDelete, onHome, onLoginPrompt }) => {
  const { user } = useAuth();
  const isGuestAtLimit = !user && records.length >= MAX_GUEST_RECORDS;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">已保存記錄</h2>
        <ActionButton onClick={onHome} className="!w-auto !py-2 !px-4 !text-sm">
          <ArrowUturnLeftIcon className="w-5 h-5 mr-1"/> 返回首頁
        </ActionButton>
      </header>
      <main className="flex-grow overflow-y-auto p-4">
        {isGuestAtLimit && (
            <NotificationCapsule 
                message={`本機已滿 ${MAX_GUEST_RECORDS} 筆。登入即可雲端保存、跨裝置查看。`}
                actionText="登入"
                onAction={onLoginPrompt}
            />
        )}
        {records.length === 0 ? (
          <div className="text-center text-gray-500 pt-16">
            <p>尚未保存任何記錄。</p>
            {!user && <p className="mt-2 text-sm">登入後即可在雲端同步您的記錄。</p>}
          </div>
        ) : (
          <ul className="space-y-3">
            {records.map(record => (
              <li key={record.id} className={`bg-white rounded-lg shadow-md border-l-4 ${getStatusColorClasses(record.fortune_status)}`}>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold">{record.room || '未命名'}</h3>
                            <p className="text-sm text-gray-600">
                                {record.mode === 'sitting' ? '坐著' : '躺在床上'} · {record.abs_deg}° {record.direction} ({record.gua})
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{record.fortune_status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(record.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="grid grid-cols-2 border-t border-gray-200">
                    <button onClick={() => onRetest(record)} className="py-2 text-sm font-semibold text-blue-500 hover:bg-blue-50 transition-colors rounded-bl-lg">重測</button>
                    <button onClick={() => onDelete(record.id)} className="py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-br-lg">刪除</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ListPage;
