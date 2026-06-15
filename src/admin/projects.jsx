import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiGithub, FiExternalLink } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const EMPTY_FORM = { title: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Web Development', featured: false };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchProjects = () => {
    api.get('/projects').then(r => setProjects(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setShowModal(true); };
  const openEdit = p => {
    setForm({ title: p.title, description: p.description, technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '', githubLink: p.githubLink || '', liveLink: p.liveLink || '', category: p.category || 'Web Development', featured: p.featured || false });
    setEditId(p._id); setImageFile(null); setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.title || !form.description) { showToast('Title and description are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) await api.put(`/projects/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast(editId ? 'Project updated!' : 'Project added!');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving project');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/projects/${id}`);
      showToast('Project deleted'); setConfirmDelete(null); fetchProjects();
    } catch { showToast('Error deleting project'); }
  };

  return (
    <AdminLayout title="Projects">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}

      <div className="admin-page-header">
        <h2>Manage Projects ({projects.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Project</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Technologies</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No projects yet. Add your first project!</td></tr>
              ) : projects.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.image && <img src={getImageUrl(p.image)} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />}
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.title}</strong>
                    </div>
                  </td>
                  <td>{(p.technologies || []).slice(0, 3).join(', ')}{p.technologies?.length > 3 ? '...' : ''}</td>
                  <td>{p.category}</td>
                  <td>{p.featured ? '⭐ Yes' : '–'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><FiGithub size={15} /></a>}
                      {p.liveLink && <a href={p.liveLink} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><FiExternalLink size={15} /></a>}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-edit" onClick={() => openEdit(p)}><FiEdit2 size={13} /> Edit</button>
                      <button className="admin-btn-delete" onClick={() => setConfirmDelete(p._id)}><FiTrash2 size={13} /> Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="admin-modal" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Project' : 'Add New Project'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Project title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Project description..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Technologies (comma-separated)</label>
                  <input className="form-input" value={form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Link</label>
                    <input className="form-input" value={form.githubLink} onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Link</label>
                    <input className="form-input" value={form.liveLink} onChange={e => setForm(p => ({ ...p, liveLink: e.target.value }))} placeholder="https://..." />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {['Web Development', 'Mobile', 'Design', 'AI/ML', 'IoT', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Image</label>
                    <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '8px 12px' }} />
                  </div>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  <label htmlFor="featured" className="form-label" style={{ margin: 0 }}>Mark as Featured</label>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update Project' : 'Add Project'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="admin-modal" style={{ maxWidth: 400 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}>
              <h3 style={{ marginBottom: 12 }}>Delete Project?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ background: '#EF4444', flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Projects;