import React from 'react';

interface NeumorphicButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ onClick, children, className = '', ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'button')}
      className={`neumorphic-button rounded-xl flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-[--primary-color] ${className}`}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;
