import React from 'react';
import { ChevronLeftIcon, CheckIcon, HomeIcon } from './icons';

interface PageHeaderProps {
  title: string;
  step: string;
  onBack: () => void;
  onHome?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, step, onBack, onHome }) => (
  <header className="relative flex items-center justify-center p-4 border-b border-gray-200">
    <button onClick={onBack} className="absolute left-4 p-2 text-gray-500 hover:text-gray-800" aria-label="Back">
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
    <div className="text-center">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{step}</p>
    </div>
    {onHome && (
      <button onClick={onHome} className="absolute right-4 p-2 text-gray-500 hover:text-gray-800" aria-label="Go to Home">
        <HomeIcon className="w-6 h-6" />
      </button>
    )}
  </header>
);

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, icon, variant = 'primary', ...props }) => {
  const baseClasses = "w-full flex items-center justify-center text-lg font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
