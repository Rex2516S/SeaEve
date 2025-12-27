import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Updated to Capitalized 'Logo.png' based on your description.
// Ensure the file in your root folder is exactly named "Logo.png"
const LOGO_SRC = "/Logo.png"; 

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'lg' }) => {
  const [imgError, setImgError] = useState(false);
  const isLarge = size === 'lg' || size === 'xl';

  // Vertical layout for large (Home), Horizontal for small (Header/Sidebar)
  const containerClasses = isLarge 
    ? 'flex flex-col items-center gap-4' 
    : 'flex items-center gap-3';

  const textClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl md:text-7xl',
    xl: 'text-8xl',
  };

  // Using height-based sizing with auto width to prevent distortion
  const imgClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-24 md:h-32 w-auto',
    xl: 'h-40 w-auto',
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      {!imgError && (
        <img 
          src={LOGO_SRC} 
          alt="SeaEve Logo" 
          className={`${imgClasses[size]} object-contain drop-shadow-sm transition-opacity duration-300`}
          onError={(e) => {
            console.error(`Failed to load logo at ${LOGO_SRC}. Please check if the file 'Logo.png' exists in the root directory.`);
            setImgError(true);
          }}
        />
      )}
      <h1 
        className={`font-bold tracking-tight select-none ${textClasses[size]}`}
      >
        <span className="bg-gradient-to-r from-yellow-400 via-lime-500 to-green-500 bg-clip-text text-transparent">
          SeaEve
        </span>
      </h1>
    </div>
  );
};