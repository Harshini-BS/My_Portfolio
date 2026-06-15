
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/themecontext.jsx';
import { AuthProvider } from './context/authcontext.jsx';
import Navbar from './navbar/navbar.jsx';
import Footer from './footer/footer.jsx';
import Home from './home/home.jsx';
import About from './about/about.jsx';
import Skills from './skills/skills.jsx';
import Projects from './projects/projects.jsx';
import Certifications from './certifications/certifications.jsx';
import Education from './education/education.jsx';
import Achievements from './achievements/achievements.jsx';
import Resume from './resume/resume.jsx';
import Contact from './contact/contact.jsx';
import Experience from './experience/experience.jsx';
import ScrollToTop from './common/scrolltotop.jsx';
import ProtectedRoute from './common/protectedroute.jsx';
import AdminLogin from './login/login.jsx';
import AdminDashboard from './dashboard/dashboard.jsx';
import AdminProjects from './admin/projects.jsx';
import AdminSkills from './admin/skills.jsx';
import AdminCertificates from './admin/certificates.jsx';
import AdminMessages from './admin/messages.jsx';
import AdminResume from './admin/resume.jsx';
import AdminExperience from './admin/experience.jsx';
import AdminAchievements from './admin/achievements.jsx';
import AdminEducation from './admin/education.jsx';
import AdminProfile from './admin/profile.jsx';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>

            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/skills" element={<><Navbar /><Skills /><Footer /></>} />
            <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
            <Route path="/certifications" element={<><Navbar /><Certifications /><Footer /></>} />
            <Route path="/education" element={<><Navbar /><Education /><Footer /></>} />
            <Route path="/experience" element={<><Navbar /><Experience /><Footer /></>} />
            <Route path="/achievements" element={<><Navbar /><Achievements /><Footer /></>} />
            <Route path="/resume" element={<><Navbar /><Resume /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

            {/* ===== ADMIN ROUTES ===== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
            <Route path="/admin/certificates" element={<ProtectedRoute><AdminCertificates /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/resume" element={<ProtectedRoute><AdminResume /></ProtectedRoute>} />
            <Route path="/admin/experience" element={<ProtectedRoute><AdminExperience /></ProtectedRoute>} />
            <Route path="/admin/achievements" element={<ProtectedRoute><AdminAchievements /></ProtectedRoute>} />
            <Route path="/admin/education" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;