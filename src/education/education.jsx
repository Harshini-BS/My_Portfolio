import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.jsx';
import './education.css';

const DEFAULT_EDUCATION = [
  {
    _id: 'default1',
    degree: 'B.E. Computer Science and Engineering',
    institution: 'Velalar College of Engineering and Technology',
    year: '2023 – 2027 (Final Year)',
    grade: '',
    description: 'Pursuing Bachelor of Engineering in Computer Science with a focus on full-stack development, data structures, algorithms, software engineering, and emerging technologies.',
    order: 1
  },
  {
    _id: 'default2',
    degree: 'Higher Secondary Education (Maths & Computer Science)',
    institution: 'Saradha Vidhyalaya Matriculation Higher Secondary School',
    year: '2022 – 2023',
    grade: '',
    description: 'Completed Higher Secondary Education with Maths and Computer Science as core subjects.',
    order: 2
  }
];

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/education')
      .then(r => setEducation(r.data.data?.length ? r.data.data : DEFAULT_EDUCATION))
      .catch(() => setEducation(DEFAULT_EDUCATION))
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
            Education
          </motion.h1>
          <div className="section-divider" />
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            My academic journey and educational qualifications.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : (
            <div className="timeline">
              {education.map((edu, i) => (
                <motion.div
                  key={edu._id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div className="timeline-card__year">{edu.year}</div>
                    <h3 className="timeline-card__degree">{edu.degree}</h3>
                    <p className="timeline-card__institution">🏫 {edu.institution}</p>
                    {edu.grade && <p className="timeline-card__grade">Grade: {edu.grade}</p>}
                    {edu.description && <p className="timeline-card__desc">{edu.description}</p>}
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

export default Education;