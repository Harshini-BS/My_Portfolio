import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import './footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span>HS</span>
            </div>
            <h3>Harshini SureshKumar</h3>
            <p>Computer Science & Engineering Student passionate about building innovative solutions.</p>
            <div className="footer__socials">
              <a href="https://github.com/Harshini-BS" target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="https://leetcode.com/u/Harshinisvs/" target="_blank" rel="noreferrer" aria-label="LeetCode"><SiLeetcode /></a>
              <a href="mailto:harshinisvs48@gmail.com" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Navigate</h4>
            <ul>
              {['/', '/about', '/skills', '/projects', '/education'].map((path, i) => (
                <li key={path}><Link to={path}>{['Home', 'About', 'Skills', 'Projects', 'Education'][i]}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>More</h4>
            <ul>
              {['/experience', '/certifications', '/achievements', '/contact'].map((path, i) => (
                <li key={path}><Link to={path}>{['Experience', 'Certifications', 'Achievements', 'Contact'][i]}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact-list">
              <li><FiMail size={14} /> harshinisvs48@gmail.com</li>
              <li>Tamil Nadu, India</li>
              <li><Link to="/resume">Download Resume →</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} Harshini SureshKumar. Built using MERN Stack.</p>
          <Link to="/admin/login" className="footer__admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;