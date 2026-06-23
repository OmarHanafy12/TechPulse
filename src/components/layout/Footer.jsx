import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="tn-footer">
      <div className='footer-container'>
        <p>&copy; {currentYear} TechPulse. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
