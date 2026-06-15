import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const EMPTY = { company: '', role: '', duration: '', type: 'Internship', description: '', responsibilities: '', technologies: '' };

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch = () => api.get('/experience').then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = item => {
    setForm({
      company: item.company, role: item.role, duration: item.duration, type: item.type || 'Internship',
      description: item.description || '',
      responsibilities: (item.responsibilities || []).join('\n'),
      technologies: (item.technologies || []).join(', ')
    });
    setEditId(item._id); setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.company || !form.role) { showToast('Company and role are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editId) await api.put(`/experience/${editId}`, payload);
      else await api.post('/experience', payload);
      showToast(editId ? 'Updated!' : 'Experience added!');
      setShowModal(false); fetch();
    } catch { showToast('Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/experience/${id}`); showToast('Deleted'); setConfirmDelete(null); fetch(); }
    catch { showToast('Error'); }
  };

  return (
    <AdminLayout title="Experience">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}
      <div className="admin-page-header">
        <h2>Experience ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Experience</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length === 0 ? (
            <div className="empty-state"><h3>No experience yet</h3><p>Add your internship or work experience.</p></div>
          ) : items.map(item => (
            <div key={item._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem' }}>{item.role}</h3>
                    <span className="badge badge-accent">{item.type}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>🏢 {item.company}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: item.description ? 10 : 0 }}>{item.duration}</p>
                  {item.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.description}</p>}
                  {item.responsibilities?.length > 0 && (
                    <ul style={{ marginTop: 10, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      {item.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  )}
                  {item.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                      {item.technologies.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="admin-actions">
                  <button className="admin-btn-edit" onClick={() => openEdit(item)}><FiEdit2 size={13} /> Edit</button>
                  <button className="admin-btn-delete" onClick={() => setConfirmDelete(item._id)}><FiTrash2 size={13} /> Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="admin-modal" style={{ maxWidth: 640 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Experience' : 'Add Experience'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input className="form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role / Position *</label>
                    <input className="form-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Web Developer Intern" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input className="form-input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. Jun 2024 – Aug 2024" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {['Internship', 'Full-time', 'Part-time', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief overview..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Responsibilities (one per line)</label>
                  <textarea className="form-input" rows={4} value={form.responsibilities} onChange={e => setForm(p => ({ ...p, responsibilities: e.target.value }))} placeholder="Built REST APIs with Node.js&#10;Developed React components..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Technologies (comma-separated)</label>
                  <input className="form-input" value={form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Experience'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="admin-modal" style={{ maxWidth: 380 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
              <h3 style={{ marginBottom: 12 }}>Delete Experience?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn" style={{ background: '#EF4444', color: 'white', flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Experience;