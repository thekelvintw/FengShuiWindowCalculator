import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ActionButton } from './common';
import { ArrowUturnLeftIcon, ArrowDownOnSquareIcon, TrashIcon } from './icons';
import * as authService from '../services/authService';

interface ProfilePageProps {
  onHome: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onHome }) => {
    const { user, logout } = useAuth();

    const handleExport = async () => {
        if (!user) return;
        const records = await authService.getCloudRecords(user.id);
        const dataStr = JSON.stringify(records, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'fortune_records_export.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        if (window.confirm("確定要刪除所有雲端資料嗎？此操作無法復原。")) {
            if (window.confirm("請再次確認：真的要永久刪除所有資料嗎？")) {
                await authService.deleteAllUserData(user.id);
                await logout();
                onHome();
            }
        }
    }

    if (!user) {
        return (
            <div className="p-6 text-center">
                <p>您尚未登入。</p>
                <ActionButton onClick={onHome} className="mt-4">返回首頁</ActionButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">個人檔案</h2>
                <ActionButton onClick={onHome} className="!w-auto !py-2 !px-4 !text-sm">
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-1"/> 返回首頁
                </ActionButton>
            </header>
            <main className="flex-grow overflow-y-auto p-6 flex flex-col items-center">
                <img src={user.photoURL} alt="User avatar" className="w-24 h-24 rounded-full mb-4 shadow-lg"/>
                <h3 className="text-2xl font-bold text-gray-800">{user.displayName}</h3>
                <p className="text-gray-500">{user.email}</p>

                <div className="w-full max-w-sm mt-12 space-y-4">
                    <ActionButton onClick={handleExport} variant="secondary" icon={<ArrowDownOnSquareIcon className="w-5 h-5" />}>
                        下載我的資料 (JSON)
                    </ActionButton>
                    <ActionButton onClick={logout} variant="secondary">
                        登出
                    </ActionButton>
                    <button onClick={handleDeleteAccount} className="w-full flex items-center justify-center text-sm font-semibold py-3 px-4 rounded-lg text-red-600 hover:bg-red-100 transition-colors">
                        <TrashIcon className="w-5 h-5 mr-2"/> 刪除所有雲端資料
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
