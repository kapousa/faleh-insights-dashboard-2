import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'welcome-logo' }) => (
  <div className={className}>
    {/* Replace the div with the F with your image */}
    <img src="/logo.png" alt="Faleh Logo" className="logo-img" />
    FALEH
  </div>
);