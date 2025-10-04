import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons';

interface NotificationCapsuleProps {
    message: string;
    actionText: string;
    onAction: () => void;
}

const NotificationCapsule: React.FC<NotificationCapsuleProps> = ({ message, actionText, onAction }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg relative mb-4 text-sm flex items-center justify-between shadow-sm">
            <div>
                <span>{message}</span>
                <button onClick={onAction} className="font-bold underline ml-2 hover:text-blue-600">
                    {actionText}
                </button>
            </div>
            <button onClick={() => setIsVisible(false)} className="ml-4 p-1 rounded-full hover:bg-blue-200" aria-label="關閉提示">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default NotificationCapsule;
