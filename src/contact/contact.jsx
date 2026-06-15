import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import api from '../utils/api.jsx';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/messages', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Get In Touch
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Have a project idea or want to collaborate? I'd love to hear from you!
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="contact-grid">
            {/* Info Panel */}
            <motion.div className="contact-info" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2>Let's Connect</h2>
              <p>I'm currently open to opportunities, collaborations, and interesting conversations about technology and development.</p>

              <div className="contact-info__items">
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FiMail /></div>
                  <div>
                    <div className="contact-info__label">Email</div>
                    <a href="mailto:harshinisvs48@gmail.com">harshinisvs48@gmail.com</a>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FiMapPin /></div>
                  <div>
                    <div className="contact-info__label">Location</div>
                    <span>Tamil Nadu, India</span>
                  </div>
                </div>
              </div>

              <div className="contact-info__socials">
                <h4>Find me on</h4>
                <div className="contact-info__social-links">
                  <a href="https://github.com/Harshini-BS" target="_blank" rel="noreferrer">
                    <FiGithub /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290" target="_blank" rel="noreferrer">
                    <FiLinkedin /> LinkedIn
                  </a>
                  <a href="https://leetcode.com/u/Harshinisvs/" target="_blank" rel="noreferrer">
                    <SiLeetcode /> LeetCode
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div className="contact-form-card" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {success ? (
                <div className="contact-success">
                  <FiCheckCircle className="contact-success__icon" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <button className="btn btn-primary" onClick={() => setSuccess(false)}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="contact-form-card__title">Send a Message</h3>

                  {error && (
                    <div className="contact-error">{error}</div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. john@example.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. Project Collaboration"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="form-input"
                      rows={5}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? (
                      <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending...</>
                    ) : (
                      <><FiSend /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;