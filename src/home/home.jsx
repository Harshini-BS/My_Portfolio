import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight, FiCode, FiStar, FiEye } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import api, { getImageUrl } from '../utils/api.jsx';
import './home.css';

const TYPING_TEXTS = [
  'Full Stack Developer',
  'CS Engineering Student',
  'Problem Solver',
  'Web Developer',
  'Open Source Enthusiast'
];

const TypeWriter = ({ texts }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = texts[idx % texts.length];
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      setText(prev => deleting ? prev.slice(0, -1) : full.slice(0, prev.length + 1));
      if (!deleting && text === full) { setTimeout(() => setDeleting(true), 1800); }
      if (deleting && text === '') { setDeleting(false); setIdx(i => i + 1); }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, texts]);

  return (
    <span className="typewriter">
      {text}<span className="typewriter__cursor">|</span>
    </span>
  );
};

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ projects: 0, skills: 0, certificates: 0 });
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
  api.post('/analytics/track', { page: '/' }).catch(() => {});

  api.get('/profile').then(r => setProfile(r.data.data)).catch(() => {});

  Promise.all([
    api.get('/projects').catch(() => ({ data: { count: 0 } })),
    api.get('/skills').catch(() => ({ data: { count: 0 } })),
    api.get('/certificates').catch(() => ({ data: { count: 0 } })),
  ]).then(([p, s, c]) => setStats({
    projects: p.data.count || p.data.data?.length || 0,
    skills: s.data.count || s.data.data?.length || 0,
    certificates: c.data.count || c.data.data?.length || 0
  }));

  api.get('/analytics/visitors')
    .then(d => { if (d.data?.totalVisitors) setVisitors(d.data.totalVisitors); })
    .catch(() => {});
}, []);

  const profileImage = profile?.profileImage ? getImageUrl(profile.profileImage) : null;

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>

        <div className="container">
          <div className="hero__content">
            <motion.div
              className="hero__text"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="hero__greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="hero__wave">👋</span>
                <span>Hello, World!</span>
              </motion.div>

              <motion.h1
                className="hero__name"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                I'm <span className="gradient-text">Harshini</span><br />
                SureshKumar
              </motion.h1>

              <motion.div
                className="hero__role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FiCode className="hero__role-icon" />
                <TypeWriter texts={profile?.typingTexts?.length ? profile.typingTexts : TYPING_TEXTS} />
              </motion.div>

              <motion.p
                className="hero__bio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                A Computer Science and Engineering student passionate about programming,
                problem-solving, and emerging technologies. I build real-world solutions
                and love collaborating to create innovative digital experiences.
              </motion.p>

              <motion.div
                className="hero__cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/projects" className="btn btn-primary">
                  View Projects <FiArrowRight />
                </Link>
                <a
                  href="http://localhost:5000/api/resume/download"
                  className="btn btn-outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiDownload /> Resume
                </a>
              </motion.div>

              <motion.div
                className="hero__socials"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <a href="https://github.com/Harshini-BS" target="_blank" rel="noreferrer" className="hero__social-link">
                  <FiGithub />
                </a>
                <a href="https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290" target="_blank" rel="noreferrer" className="hero__social-link">
                  <FiLinkedin />
                </a>
                <a href="https://leetcode.com/u/Harshinisvs/" target="_blank" rel="noreferrer" className="hero__social-link">
                  <SiLeetcode />
                </a>
                <a href="mailto:harshinisvs48@gmail.com" className="hero__social-link">
                  <FiMail />
                </a>
              </motion.div>

              {/* Visitor Counter */}
              <motion.div
                className="hero__visitors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <FiEye size={14} />
                <span>{visitors > 0 ? `${visitors} profile views` : 'Be the first to visit!'}</span>
              </motion.div>

            </motion.div>

            <motion.div
              className="hero__image-area"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="hero__image-ring">
                <div className="hero__image-inner">
                  {profileImage ? (
                    <img src={profileImage} alt="Harshini SureshKumar" className="hero__photo" />
                  ) : (
                    <div className="hero__photo-placeholder">
                      <span>HS</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="hero__floating-card hero__floating-card--1">
                <FiCode className="hero__fc-icon" />
                <span>Full Stack Dev</span>
              </div>
              <div className="hero__floating-card hero__floating-card--2">
                <FiStar className="hero__fc-icon" />
                <span>Final Year CSE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        <div className="container">
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { label: 'Projects Built', value: stats.projects || 3, suffix: '+' },
              { label: 'Skills Mastered', value: stats.skills || 20, suffix: '+' },
              { label: 'Certifications', value: stats.certificates || 5, suffix: '+' },
              { label: 'Profile Views', value: visitors || 100, suffix: '+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="stat-card__value">
                  {stat.value}<span>{stat.suffix}</span>
                </div>
                <div className="stat-card__label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Links - NO blog section */}
      <section className="section home-links">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore My Work
          </motion.h2>
          <div className="section-divider" />
          <div className="home-links__grid">
            {[
              { to: '/projects', icon: '💻', title: 'Projects', desc: 'Full-stack applications and designs' },
              { to: '/skills', icon: '⚡', title: 'Skills', desc: "Technical & soft skills I've built" },
              { to: '/education', icon: '🎓', title: 'Education', desc: 'B.E. Computer Science Engineering' },
              { to: '/certifications', icon: '🏆', title: 'Certifications', desc: 'Courses and professional certificates' },
              { to: '/achievements', icon: '🥇', title: 'Achievements', desc: 'Hackathons, awards & competitions' },
              { to: '/contact', icon: '✉️', title: 'Get in Touch', desc: "Let's collaborate or connect" },
            ].map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={item.to} className="quick-card">
                  <div className="quick-card__icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <FiArrowRight className="quick-card__arrow" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;