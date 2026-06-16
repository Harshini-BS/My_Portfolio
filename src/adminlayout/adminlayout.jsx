import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../context/authcontext.jsx";
import { useTheme } from "../context/themecontext.jsx";
import {
  FiGrid, FiCode, FiAward, FiBookOpen, FiMail, FiFileText,
  FiBriefcase, FiStar, FiLogOut, FiMenu, FiX, FiSun, FiMoon,
  FiUser, FiBook, FiMessageSquare, FiUpload, FiHome
} from 'react-icons/fi';
import './adminlayout.css';

const navItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/admin/profile', icon: FiUser, label: 'Profile' },
  { path: '/admin/projects', icon: FiCode, label: 'Projects' },
  { path: '/admin/skills', icon: FiStar, label: 'Skills' },
  { path: '/admin/certificates', icon: FiAward, label: 'Certificates' },
  { path: '/admin/education', icon: FiBookOpen, label: 'Education' },
  { path: '/admin/experience', icon: FiBriefcase, label: 'Experience' },
  { path: '/admin/achievements', icon: FiStar, label: 'Achievements' },
  { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
  { path: '/admin/resume', icon: FiUpload, label: 'Resume' },
];

const AdminLayout = ({ children, title }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <span>HS</span>
          </div>
          <div>
            <div className="admin-sidebar__brand">Admin Panel</div>
            <div className="admin-sidebar__user">{user?.name || 'Harshini'}</div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ path, icon: Icon, label, exact }) => (
            <Link
              key={path}
              to={path}
              className={`admin-nav-item ${isActive(path, exact) ? 'admin-nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item">
            <FiHome size={18} /> <span>View Site</span>
          </a>
          <button className="admin-nav-item admin-nav-item--logout" onClick={handleLogout}>
            <FiLogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button className="admin-header__menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <h1 className="admin-header__title">{title}</h1>
          </div>
          <div className="admin-header__right">
            <button className="admin-header__theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <div className="admin-header__avatar">{user?.name?.[0] || 'H'}</div>
          </div>
        </header>

        <main className="admin-content">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;