import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'welcome-logo' }) => (
  <div className={className}>
    <div className="logo-hex">F</div> FALEH
  </div>
);