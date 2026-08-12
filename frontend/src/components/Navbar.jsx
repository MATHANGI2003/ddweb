import React from 'react';
import { Link } from 'react-router-dom';
import {  Code } from 'lucide-react';
import './Navbar.css'; // Let's add specific styles here

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-container container">
        <Link to="/" className="nav-logo">
          <Code className="logo-icon" />
          <span className="gradient-text">DDWebsite</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/contact" className="btn-primary nav-cta">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
