import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../utils/api.jsx';
import './Certifications.css';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/certificates')
      .then(r => setCerts(r.data.data || []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Certifications
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Professional certifications and courses that have shaped my expertise.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : certs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
              <h3>Certifications Coming Soon</h3>
              <p>Certificates will be added by the admin. Check back soon!</p>
            </div>
          ) : (
            <div className="certs-grid">
              {certs.map((cert, i) => (
                <motion.div
                  key={cert._id}
                  className="cert-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(cert)}
                >
                  <div className="cert-card__image">
                    {cert.image ? (
                      <img src={getImageUrl(cert.image)} alt={cert.title} />
                    ) : (
                      <div className="cert-card__image-placeholder">🏅</div>
                    )}
                  </div>
                  <div className="cert-card__body">
                    <div className="cert-card__org">{cert.organization}</div>
                    <h3 className="cert-card__title">{cert.title}</h3>
                    {cert.date && <div className="cert-card__date">{cert.date}</div>}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="cert-card__verify"
                        onClick={e => e.stopPropagation()}>
                        Verify Certificate →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            {selected.image && <img src={getImageUrl(selected.image)} alt={selected.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />}
            <h2>{selected.title}</h2>
            <p style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{selected.organization}</p>
            {selected.date && <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{selected.date}</p>}
            {selected.credentialUrl && (
              <a href={selected.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: 16 }}>
                Verify Certificate →
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Certifications;