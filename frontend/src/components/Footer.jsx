import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2 className="gradient-text">DDWebsite</h2>
          <p>Building next-generation web and mobile applications for professionals everywhere.</p>
        </div>
        <div className="footer-links">
          <p>&copy; {new Date().getFullYear()} DDWebsite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
