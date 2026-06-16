import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../utils/api.jsx';
import './achievements.css';

const CATEGORY_ICONS = { Award: '🏆', Competition: '🥇', Hackathon: '💡', 'Paper Presentation': '📄', Other: '⭐' };

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api.get('/achievements')
      .then(r => setAchievements(r.data.data || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(achievements.map(a => a.category))];
  const filtered = active === 'All' ? achievements : achievements.filter(a => a.category === active);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Achievements
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Awards, competitions, hackathons, and academic recognitions.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {categories.length > 1 && (
            <div className="skills-filter" style={{ marginBottom: 40 }}>
              {categories.map(cat => (
                <button key={cat} className={`skills-filter__btn ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>
                  {CATEGORY_ICONS[cat] || ''} {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
              <h3>Achievements Coming Soon</h3>
              <p>Awards and recognition details will be added soon.</p>
            </div>
          ) : (
            <div className="achievements-grid">
              {filtered.map((ach, i) => (
                <motion.div
                  key={ach._id}
                  className="achievement-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="achievement-card__icon">
                    {ach.image ? (
                      <img src={getImageUrl(ach.image)} alt={ach.title} />
                    ) : (
                      <span>{CATEGORY_ICONS[ach.category] || '⭐'}</span>
                    )}
                  </div>
                  <div className="achievement-card__body">
                    <span className="badge badge-primary" style={{ marginBottom: 10 }}>{ach.category}</span>
                    <h3>{ach.title}</h3>
                    {ach.organization && <p className="achievement-card__org">{ach.organization}</p>}
                    {ach.date && <p className="achievement-card__date">{ach.date}</p>}
                    {ach.description && <p className="achievement-card__desc">{ach.description}</p>}
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

export default Achievements;