import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.jsx';
import './skills.css';

const DEFAULT_SKILLS = [
  { name: 'React.js', category: 'Frontend', proficiency: 85 },
  { name: 'HTML', category: 'Frontend', proficiency: 95 },
  { name: 'CSS', category: 'Frontend', proficiency: 90 },
  { name: 'JavaScript', category: 'Frontend', proficiency: 82 },
  { name: 'MongoDB', category: 'Database', proficiency: 78 },
  { name: 'Git & GitHub', category: 'Tools', proficiency: 88 },
  { name: 'Agile Methodology', category: 'Other', proficiency: 80 },
  { name: 'Java', category: 'Programming Languages', proficiency: 80 },
  { name: 'Software Project Management', category: 'Other', proficiency: 75 },
  { name: 'IoT', category: 'Other', proficiency: 70 },
  { name: 'Prototyping', category: 'Design', proficiency: 75 },
  { name: 'Figma', category: 'Design', proficiency: 80 },
  { name: 'Canva', category: 'Design', proficiency: 85 },
  { name: 'Active Learner', category: 'Soft Skills', proficiency: 95 },
  { name: 'Collaborative Person', category: 'Soft Skills', proficiency: 90 },
  { name: 'Postman API', category: 'Tools', proficiency: 78 },
  { name: 'Problem Solving', category: 'Soft Skills', proficiency: 88 },
  { name: 'Teamwork', category: 'Soft Skills', proficiency: 92 },
];

const CATEGORY_ORDER = ['Frontend', 'Programming Languages', 'Backend', 'Database', 'Tools', 'Design', 'Soft Skills', 'Other'];

const SkillBar = ({ skill, index }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(skill.proficiency), 200 + index * 60);
    return () => clearTimeout(t);
  }, [skill.proficiency, index]);

  return (
    <motion.div
      className="skill-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="skill-item__header">
        <span className="skill-item__name">{skill.name}</span>
        <span className="skill-item__pct">{skill.proficiency}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar__fill"
          style={{ width: `${width}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/skills')
      .then(r => setSkills(r.data.data?.length ? r.data.data : DEFAULT_SKILLS))
      .catch(() => setSkills(DEFAULT_SKILLS))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...CATEGORY_ORDER.filter(c => skills.some(s => s.category === c))];
  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);

  const grouped = {};
  filtered.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Skills & Expertise
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            A comprehensive overview of my technical skills, tools, and personal strengths.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* Category Filter */}
          <div className="skills-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`skills-filter__btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : (
            <div className="skills-container">
              {(activeCategory === 'All' ? CATEGORY_ORDER.filter(c => grouped[c]) : [activeCategory]).map(category => (
                grouped[category] && (
                  <motion.div
                    key={category}
                    className="skills-category"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="skills-category__header">
                      <h3>{category}</h3>
                      <span className="badge badge-accent">{grouped[category].length} skills</span>
                    </div>
                    <div className="skills-grid">
                      {grouped[category].map((skill, i) => (
                        <SkillBar key={skill._id || skill.name} skill={skill} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Skills;