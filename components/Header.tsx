import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <img
          src="https://assets.unileversolutions.com/v1/120341483.png"
          alt="P/S Logo"
          className="h-10 md:h-12"
        />
      </div>
    </header>
  );
};