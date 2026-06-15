import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUpload } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const Profile = () => {
  const [form, setForm] = useState({
    name: 'Harshini SureshKumar',
    title: 'Computer Science & Engineering Student',
    subtitle: 'Aspiring Full Stack Developer',
    bio: '',
    email: 'harshinisvs48@gmail.com',
    phone: '',
    location: 'Tamil Nadu, India',
    github: 'https://github.com/Harshini-BS',
    linkedin: 'https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290',
    leetcode: 'https://leetcode.com/u/Harshinisvs/',
    typingTexts: 'Full Stack Developer, CS Engineering Student, Problem Solver, Web Developer',
    about: '',
    objective: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    api.get('/profile').then(r => {
      const p = r.data.data;
      if (p) {
        setForm(prev => ({
          ...prev,
          name: p.name || prev.name,
          title: p.title || prev.title,
          subtitle: p.subtitle || prev.subtitle,
          bio: p.bio || '',
          email: p.email || prev.email,
          phone: p.phone || '',
          location: p.location || prev.location,
          github: p.github || prev.github,
          linkedin: p.linkedin || prev.linkedin,
          leetcode: p.leetcode || prev.leetcode,
          typingTexts: Array.isArray(p.typingTexts) ? p.typingTexts.join(', ') : (p.typingTexts || prev.typingTexts),
          about: p.about || '',
          objective: p.objective || ''
        }));
        if (p.profileImage) setPreviewImage(getImageUrl(p.profileImage));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (profileImage) fd.append('profileImage', profileImage);
      await api.put('/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Error saving profile');
    } finally { setSaving(false); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (loading) return <AdminLayout title="Profile"><div className="loader"><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout title="Profile Settings">
      {toast && <div className={`toast toast-${toast.includes('Error') ? 'error' : 'success'}`}>{toast}</div>}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Left: Avatar */}
          <motion.div className="card" style={{ padding: 28, textAlign: 'center', position: 'sticky', top: 80 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', background: 'var(--gradient)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-primary)' }}>
              {previewImage ? (
                <img src={previewImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>HS</span>
              )}
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{form.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{form.title}</p>
            <label className="btn btn-outline" style={{ cursor: 'pointer', width: '100%', justifyContent: 'center', marginBottom: 0 }}>
              <FiUpload size={14} /> Upload Photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
          </motion.div>

          {/* Right: Form Fields */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Basic Info */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => f('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => f('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Title / Role</label>
                  <input className="form-input" value={form.title} onChange={e => f('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input className="form-input" value={form.subtitle} onChange={e => f('subtitle', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={e => f('location', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Typing Texts (comma-separated, shown in hero animation)</label>
                <input className="form-input" value={form.typingTexts} onChange={e => f('typingTexts', e.target.value)} placeholder="Full Stack Developer, Web Developer, Problem Solver" />
              </div>
            </div>

            {/* Social Links */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Social Links</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input className="form-input" value={form.github} onChange={e => f('github', e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input className="form-input" value={form.linkedin} onChange={e => f('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">LeetCode URL</label>
                  <input className="form-input" value={form.leetcode} onChange={e => f('leetcode', e.target.value)} placeholder="https://leetcode.com/u/..." />
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>About Content</h3>
              <div className="form-group">
                <label className="form-label">Short Bio (shown in hero)</label>
                <textarea className="form-input" rows={3} value={form.bio} onChange={e => f('bio', e.target.value)} placeholder="A brief intro about yourself..." />
              </div>
              <div className="form-group">
                <label className="form-label">About Me (full paragraph)</label>
                <textarea className="form-input" rows={5} value={form.about} onChange={e => f('about', e.target.value)} placeholder="Detailed about section..." />
              </div>
              <div className="form-group">
                <label className="form-label">Career Objective</label>
                <textarea className="form-input" rows={3} value={form.objective} onChange={e => f('objective', e.target.value)} placeholder="Your career goals and objectives..." />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {saving ? 'Saving...' : <><FiSave /> Save Profile</>}
            </button>
          </motion.div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default Profile;