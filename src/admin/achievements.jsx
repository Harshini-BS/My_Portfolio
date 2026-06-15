import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from '../utils/api.jsx';

const CATEGORIES = ['Award', 'Competition', 'Hackathon', 'Paper Presentation', 'Other'];
const EMPTY = { title: '', category: 'Award', description: '', date: '', organization: '' };

const Achievements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch = () => api.get('/achievements').then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setImageFile(null); setShowModal(true); };
  const openEdit = item => {
    setForm({ title: item.title, category: item.category || 'Award', description: item.description || '', date: item.date || '', organization: item.organization || '' });
    setEditId(item._id); setImageFile(null); setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.title) { showToast('Title is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) await api.put(`/achievements/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/achievements', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast(editId ? 'Updated!' : 'Achievement added!');
      setShowModal(false); fetch();
    } catch { showToast('Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/achievements/${id}`); showToast('Deleted'); setConfirmDelete(null); fetch(); }
    catch { showToast('Error'); }
  };

  const ICONS = { Award: '🏆', Competition: '🥇', Hackathon: '💡', 'Paper Presentation': '📄', Other: '⭐' };

  return (
    <AdminLayout title="Achievements">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}
      <div className="admin-page-header">
        <h2>Achievements ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Achievement</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.length === 0 ? (
            <div className="empty-state"><h3>No achievements yet</h3><p>Add your awards, competitions and recognitions.</p></div>
          ) : items.map(item => (
            <div key={item._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 14, flex: 1, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(124,58,237,0.1)', display: 'grid', placeItems: 'center', fontSize: '1.5rem', flexShrink: 0, overflow: 'hidden' }}>
                    {item.image ? <img src={getImageUrl(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{ICONS[item.category] || '⭐'}</span>}
                  </div>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: 6 }}>{item.category}</span>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{item.title}</h3>
                    {item.organization && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.organization}</p>}
                    {item.date && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{item.date}</p>}
                    {item.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 6 }}>{item.description}</p>}
                  </div>
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
            <motion.div className="admin-modal" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Achievement' : 'Add Achievement'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. First Place - HackFest 2024" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. March 2024" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input className="form-input" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Organizing body" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image (optional)</label>
                    <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '8px 12px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Achievement'}
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
              <h3 style={{ marginBottom: 12 }}>Delete Achievement?</h3>
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

export default Achievements;