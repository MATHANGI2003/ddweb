import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Smartphone, Rocket, Shield, Zap, Layout } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home animate-fade-in-up">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <h1 className="hero-title">
            Empowering Your Business With <br/>
            <span className="gradient-text">Next-Gen Digital Solutions</span>
          </h1>
          <p className="hero-subtitle">
            We build premium websites and mobile applications tailored for professionals across all industries. Elevate your brand today.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn-primary">Start Your Project</Link>
            <a href="#services" className="btn-secondary">Explore Services</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services container">
        <div className="section-header">
          <h2 className="gradient-text">Our Expertise</h2>
          <p>Cutting-edge technologies delivering unparalleled performance.</p>
        </div>

        <div className="services-grid">
          <div className="service-card glass-panel">
            <div className="service-icon-wrapper">
              <Code className="service-icon" />
            </div>
            <h3>Website Development</h3>
            <p>Custom, responsive, and high-performance websites built with modern frameworks to engage your audience.</p>
          </div>
          
          <div className="service-card glass-panel">
            <div className="service-icon-wrapper">
              <Smartphone className="service-icon" />
            </div>
            <h3>App Development</h3>
            <p>Sleek, intuitive mobile applications for iOS and Android that put your business in your customers' pockets.</p>
          </div>

          <div className="service-card glass-panel">
            <div className="service-icon-wrapper">
              <Layout className="service-icon" />
            </div>
            <h3>UI/UX Design</h3>
            <p>Premium aesthetics and seamless user journeys that make your digital presence unforgettable.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="features-grid">
          <div className="feature-item">
            <Rocket className="feature-icon" />
            <h4>Fast Delivery</h4>
            <p>Rapid development cycles without compromising on quality.</p>
          </div>
          <div className="feature-item">
            <Shield className="feature-icon" />
            <h4>Secure & Reliable</h4>
            <p>Enterprise-grade security built into every application.</p>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" />
            <h4>High Performance</h4>
            <p>Optimized code and blazing fast load times.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
