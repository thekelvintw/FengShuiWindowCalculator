
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  onUndo?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, onUndo }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out transition
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-auto max-w-xs p-4 rounded-lg shadow-lg bg-gray-800 text-white flex items-center justify-between transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={handleUndo}
          className="ml-4 font-bold text-blue-300 hover:text-blue-200"
        >
          撤銷
        </button>
      )}
    </div>
  );
};

export default Toast;