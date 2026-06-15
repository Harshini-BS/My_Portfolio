import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFileText } from 'react-icons/fi';
import api from '../utils/api.jsx';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    api.get('/resume')
      .then(r => setResume(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Resume
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Download or view my latest resume.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <motion.div
            className="card"
            style={{ textAlign: 'center', padding: '60px 40px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ fontSize: '5rem', marginBottom: 24 }}>
              <FiFileText style={{ margin: '0 auto', display: 'block', color: 'var(--primary)' }} />
            </div>
            <h2 style={{ marginBottom: 12 }}>Harshini SureshKumar</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Computer Science & Engineering Student</p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '0.9rem' }}>Aspiring Full Stack Developer</p>

            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : resume ? (
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`${BACKEND_URL}${resume.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  <FiEye /> View Resume
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resume/download`}
                  className="btn btn-primary"
                  download
                >
                  <FiDownload /> Download Resume
                </a>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                  Resume not yet uploaded. Please check back soon or contact me directly.
                </p>
                <a href="mailto:harshinisvs48@gmail.com" className="btn btn-primary">
                  Contact Me
                </a>
              </div>
            )}

            {resume && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 24 }}>
                Last updated: {new Date(resume.uploadedAt || resume.createdAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Resume;