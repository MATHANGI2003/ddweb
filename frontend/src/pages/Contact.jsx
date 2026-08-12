import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', profession: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page animate-fade-in-up container">
      <div className="contact-header section-header">
        <h1 className="gradient-text">Let's Build Together</h1>
        <p>Tell us about your project or profession, and we'll create the perfect digital solution for you.</p>
      </div>

      <div className="contact-container">
        {/* Contact Info Sidebar */}
        <div className="contact-info glass-panel">
          <h3>Get In Touch</h3>
          <p className="info-desc">Reach out to us directly or fill out the form, and our team will get back to you within 24 hours.</p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="icon-circle">
                <Mail className="info-icon" />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>mathangik10@gmail.com</p>
                <p>rkmov23@gmail.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-circle">
                <Phone className="info-icon" />
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+91 9840170450</p>
                <p>+91 9884743811</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <MapPin className="info-icon" />
              </div>
              <div>
                <h4>Location</h4>
                <p>Perambur, Chennai-600011</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper glass-panel">
          <form onSubmit={handleSubmit} className="contact-form">
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-input" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Profession / Industry</label>
              <input 
                type="text" 
                name="profession" 
                className="form-input" 
                placeholder="e.g. Real Estate, E-commerce, Healthcare"
                value={formData.profession}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Details</label>
              <textarea 
                name="message" 
                className="form-textarea" 
                placeholder="Tell us about what you want to build..."
                value={formData.message}
                onChange={handleChange}
                required 
              ></textarea>
            </div>

            <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {!isSubmitting && <Send className="submit-icon" size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
