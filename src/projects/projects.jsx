import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiSearch, FiFilter } from 'react-icons/fi';
import api, { getImageUrl } from '../utils/api.jsx';
import './projects.css';

const DEFAULT_PROJECTS = [
  {
    _id: '1',
    title: 'Campus Event Hub',
    description: 'Campus Event Hub is a centralized system designed to simplify event management in educational institutions. It allows administrators to create and manage events while enabling students to explore, register, and participate in various campus activities seamlessly.',
    technologies: ['Angular', 'Node.js', 'Express.js', 'MongoDB'],
    githubLink: 'https://github.com/Harshini-BS/Campus-Event-Hub',
    liveLink: '',
    category: 'Web Development',
    featured: true
  },
  {
    _id: '2',
    title: 'MediBook - AI-Powered Healthcare Appointment Booking System',
    description: 'MediBook is a healthcare appointment system that helps users book, manage, and cancel hospital appointments with AI-based symptom guidance for selecting the right medical department.',
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    githubLink: 'https://github.com/Harshini-BS/MediBook-AI-Powered-Healthcare-Appointment-Booking-System',
    liveLink: '',
    category: 'Web Development',
    featured: true
  },
  {
    _id: '3',
    title: 'UI/UX Design Portfolio',
    description: 'Designed modern and user-friendly UI/UX interfaces using Figma. Focused on creating intuitive user experiences, clean visual designs, and mobile-friendly interfaces through wireframes, prototypes, and high-fidelity mockups.',
    technologies: ['Figma'],
    githubLink: 'https://github.com/Harshini-BS/UI_UX-Design',
    liveLink: '',
    category: 'Design',
    featured: false
  }
];

const ProjectCard = ({ project, index }) => {
  const imageUrl = getImageUrl(project.image);
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {project.featured && <div className="project-card__featured">⭐ Featured</div>}
      <div className="project-card__image">
        {imageUrl ? (
          <img src={imageUrl} alt={project.title} />
        ) : (
          <div className="project-card__image-placeholder">
            <span>{project.title.charAt(0)}</span>
          </div>
        )}
        <div className="project-card__overlay">
          <div className="project-card__overlay-links">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="project-card__link">
                <FiGithub /> GitHub
              </a>
            )}
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="project-card__link">
                <FiExternalLink /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="project-card__body">
        <div className="project-card__category">{project.category}</div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tech">
          {(project.technologies || []).map(t => (
            <span key={t} className="badge badge-primary">{t}</span>
          ))}
        </div>
        <div className="project-card__actions">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <FiGithub /> Code
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <FiExternalLink /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tech, setTech] = useState('');

  const fetchProjects = useCallback(() => {
    api.get('/projects', { params: { search, category: category !== 'all' ? category : undefined, tech: tech || undefined } })
      .then(r => setProjects(r.data.data?.length ? r.data.data : DEFAULT_PROJECTS))
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoading(false));
  }, [search, category, tech]);

  useEffect(() => {
    const t = setTimeout(fetchProjects, 400);
    return () => clearTimeout(t);
  }, [fetchProjects]);

  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const allTechs = [...new Set(projects.flatMap(p => p.technologies || []))].slice(0, 12);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            My Projects
          </motion.h1>
          <div className="section-divider" />
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            A collection of projects I've built — from full-stack web apps to UI/UX designs.
          </motion.p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* Filters */}
          <div className="projects-filters">
            <div className="projects-search">
              <FiSearch className="projects-search__icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="projects-search__input"
              />
            </div>
            <div className="projects-filter-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`skills-filter__btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
            {allTechs.length > 0 && (
              <div className="projects-tech-filter">
                <FiFilter size={14} />
                <select value={tech} onChange={e => setTech(e.target.value)} className="form-input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
                  <option value="">All Technologies</option>
                  {allTechs.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found matching your search.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Projects;