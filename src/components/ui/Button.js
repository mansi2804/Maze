import React from 'react';
import { playClickSound } from '../../utils/sounds';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light',
    accent: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent-light',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-200',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const handleClick = (e) => {
    if (!disabled) {
      playClickSound();
      if (onClick) onClick(e);
    }
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {Icon && (
        <span className={`${children ? 'mr-2' : ''}`}>
          <Icon className="w-5 h-5" />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
