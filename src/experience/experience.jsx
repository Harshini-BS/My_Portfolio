import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';
import api from '../utils/api.jsx';
import './experience.css';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/experience')
      .then(r => setExperience(r.data.data || []))
      .catch(() => setExperience([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Experience
          </motion.h1>
          <div className="section-divider" />
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Internships and work experience that have shaped my professional growth.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : experience.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>
                <FiBriefcase />
              </div>
              <h3>Experience Coming Soon</h3>
              <p>Internship and work experience details will be added soon.</p>
            </div>
          ) : (
            <div className="timeline">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp._id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                      <div className="timeline-card__year">{exp.duration}</div>
                      <span className="badge badge-accent">{exp.type}</span>
                    </div>
                    <h3 className="timeline-card__degree">{exp.role}</h3>
                    <p className="timeline-card__institution">🏢 {exp.company}</p>
                    {exp.description && (
                      <p className="timeline-card__desc">{exp.description}</p>
                    )}
                    {exp.responsibilities?.length > 0 && (
                      <div className="exp-responsibilities">
                        <h4>Key Responsibilities</h4>
                        <ul>
                          {exp.responsibilities.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.technologies?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                        {exp.technologies.map(t => (
                          <span key={t} className="badge badge-primary">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Experience;