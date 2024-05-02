import React from 'react';
import logoImage from './RES/logo.png'; // Import obrazu logo

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="Logo" className="logo-image" />
    </div>
  );
};

export default Logo;
