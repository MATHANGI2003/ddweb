import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Smartphone, Rocket, Shield, Zap, Layout, Coffee, Car, Scissors, GraduationCap } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home animate-fade-in-up">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content animate-slide-in-left">
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
        <div className="hero-image-wrapper animate-float">
          <img src="/hero-developer.png" alt="Web Development Illustration" className="hero-image" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services container">
        <div className="section-header">
          <h2 className="gradient-text">Core Digital Solutions</h2>
          <p>Elevate your brand with our premium central services.</p>
        </div>

        <div className="services-main-grid">
          <div className="service-card-main glass-panel">
            <div className="service-img-wrapper">
              <img src="/ui-ux.png" alt="UI/UX Design" className="service-main-img" />
            </div>
            <h3>UI/UX Design</h3>
            <p>Premium aesthetics and seamless user journeys that make your digital presence unforgettable.</p>
          </div>
          
          <div className="service-card-main glass-panel center-card">
            <div className="service-img-wrapper">
              <img src="/app-dev.png" alt="App Development" className="service-main-img" />
            </div>
            <h3>App Development</h3>
            <p>Sleek, intuitive mobile applications for iOS and Android that put your business in your customer's pockets.</p>
          </div>

          <div className="service-card-main glass-panel">
            <div className="service-img-wrapper">
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Website Development" className="service-main-img" />
            </div>
            <h3>Website Development</h3>
            <p>Custom, responsive, and high-performance websites built with modern frameworks to engage your customers.</p>
          </div>
        </div>

        <div className="section-header subdivisions-header">
          <h3 className="gradient-text">Industry Expertise</h3>
          <p>Tailored solutions for your specific market.</p>
        </div>

        <div className="services-sub-grid">
          <div className="service-card-sub glass-panel">
            <div className="service-icon-wrapper">
              <Coffee className="service-icon" />
            </div>
            <h4>Restaurant & Cafe</h4>
            <p>Appetizing websites and ordering systems.</p>
          </div>

          <div className="service-card-sub glass-panel">
            <div className="service-icon-wrapper">
              <Car className="service-icon" />
            </div>
            <h4>Automotive</h4>
            <p>Dynamic digital showrooms and booking.</p>
          </div>

          <div className="service-card-sub glass-panel">
            <div className="service-icon-wrapper">
              <Scissors className="service-icon" />
            </div>
            <h4>Beauty & Salon</h4>
            <p>Elegant websites with integrated scheduling.</p>
          </div>

          <div className="service-card-sub glass-panel">
            <div className="service-icon-wrapper">
              <GraduationCap className="service-icon" />
            </div>
            <h4>Education</h4>
            <p>Engaging portals for colleges and schools.</p>
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
