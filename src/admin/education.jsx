import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const EMPTY = { degree: '', institution: '', year: '', grade: '', description: '' };

const Education = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch = () => api.get('/education').then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = item => {
    setForm({ degree: item.degree, institution: item.institution, year: item.year, grade: item.grade || '', description: item.description || '' });
    setEditId(item._id); setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.degree || !form.institution || !form.year) { showToast('Degree, institution and year are required'); return; }
    setSaving(true);
    try {
      if (editId) await api.put(`/education/${editId}`, form);
      else await api.post('/education', form);
      showToast(editId ? 'Updated!' : 'Education added!');
      setShowModal(false); fetch();
    } catch { showToast('Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/education/${id}`); showToast('Deleted'); setConfirmDelete(null); fetch(); }
    catch { showToast('Error'); }
  };

  return (
    <AdminLayout title="Education">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}
      <div className="admin-page-header">
        <h2>Education ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Education</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length === 0 ? (
            <div className="empty-state"><h3>No education entries yet</h3><p>Add your academic qualifications.</p></div>
          ) : items.map(item => (
            <div key={item._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎓</span>
                    <span className="badge badge-accent" style={{ fontFamily: 'var(--font-mono)' }}>{item.year}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{item.degree}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 4 }}>🏫 {item.institution}</p>
                  {item.grade && <p style={{ color: 'var(--primary-light)', fontSize: '0.88rem', fontWeight: 600 }}>Grade: {item.grade}</p>}
                  {item.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 8, lineHeight: 1.6 }}>{item.description}</p>}
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
            <motion.div className="admin-modal" style={{ maxWidth: 560 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Education' : 'Add Education'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Degree / Qualification *</label>
                  <input className="form-input" value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} placeholder="e.g. B.E. Computer Science and Engineering" />
                </div>
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input className="form-input" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. Velalar College of Engineering" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input className="form-input" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="e.g. 2021 – 2025 (Final Year)" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grade / CGPA</label>
                    <input className="form-input" value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} placeholder="e.g. 8.5 CGPA" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of your studies..." />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Education'}
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
              <h3 style={{ marginBottom: 12 }}>Delete Education?</h3>
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

export default Education;