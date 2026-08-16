import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-container container">
        <NavLink to="/" className="nav-logo" end>
          <span className="gradient-text">DDWebsite</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>Home</NavLink>
          <a href="/#services" className="nav-link">Services</a>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Contact</NavLink>
          <Link to="/contact" className="btn-primary nav-cta">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
