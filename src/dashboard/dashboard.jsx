import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiAward, FiBook, FiMessageSquare, FiEye, FiUsers, FiStar, FiBriefcase } from 'react-icons/fi';
import AdminLayout from '../adminlayout/adminlayout.jsx';
import api from '../utils/api.jsx';
import './dashboard.css';

const StatCard = ({ icon: Icon, label, value, color, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link to={link} className="dash-stat-card" style={{ '--card-color': color }}>
      <div className="dash-stat-card__icon"><Icon size={22} /></div>
      <div className="dash-stat-card__value">{value ?? '–'}</div>
      <div className="dash-stat-card__label">{label}</div>
    </Link>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/stats')
      .then(r => setStats(r.data.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: FiCode, label: 'Projects', value: stats?.projects, color: '#7C3AED', link: '/admin/projects' },
    { icon: FiStar, label: 'Skills', value: stats?.skills, color: '#06B6D4', link: '/admin/skills' },
    { icon: FiAward, label: 'Certificates', value: stats?.certificates, color: '#F59E0B', link: '/admin/certificates' },
    { icon: FiMessageSquare, label: 'Messages', value: stats?.messages, color: '#EF4444', link: '/admin/messages' },
    { icon: FiMessageSquare, label: 'Unread', value: stats?.unreadMessages, color: '#F97316', link: '/admin/messages' },
    { icon: FiUsers, label: 'Total Visitors', value: stats?.totalVisitors, color: '#8B5CF6', link: '/admin' },
    { icon: FiEye, label: 'Page Views', value: stats?.totalPageViews, color: '#EC4899', link: '/admin' },
  ];

  const quickLinks = [
    { to: '/admin/projects', label: 'Add Project', icon: FiCode },
    { to: '/admin/skills', label: 'Manage Skills', icon: FiStar },
    { to: '/admin/certificates', label: 'Add Certificate', icon: FiAward },
    { to: '/admin/messages', label: 'View Messages', icon: FiMessageSquare },
    { to: '/admin/resume', label: 'Upload Resume', icon: FiBriefcase },
    { to: '/admin/experience', label: 'Add Experience', icon: FiBriefcase },
    { to: '/admin/achievements', label: 'Add Achievement', icon: FiAward },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard">
        <div className="dashboard__welcome">
          <div>
            <h2>Welcome back, Harshini! 👋</h2>
            <p>Here's an overview of your portfolio.</p>
          </div>
          <Link to="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            <FiEye size={14} /> View Portfolio
          </Link>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <>
            <div className="dash-stats-grid">
              {statCards.map((card, i) => (
                <StatCard key={card.label} {...card} delay={i * 0.06} />
              ))}
            </div>

            <div className="dash-section">
              <h3 className="dash-section__title">Quick Actions</h3>
              <div className="dash-quick-grid">
                {quickLinks.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} className="dash-quick-link">
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {stats?.recentAnalytics?.length > 0 && (
              <div className="dash-section">
                <h3 className="dash-section__title">Recent Traffic (Last 7 Days)</h3>
                <div className="dash-analytics">
                  {stats.recentAnalytics.slice(0, 7).map(day => (
                    <div key={day.date} className="dash-analytics__row">
                      <span className="dash-analytics__date">{day.date}</span>
                      <div className="dash-analytics__bar-wrap">
                        <div
                          className="dash-analytics__bar"
                          style={{ width: `${Math.min(100, (day.visitors / Math.max(...stats.recentAnalytics.map(d => d.visitors), 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="dash-analytics__count">{day.visitors} visitors</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;