import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const CATEGORIES = ['Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Design', 'Other'];
const EMPTY = { name: '', category: 'Frontend', proficiency: 80 };

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch = () => api.get('/skills').then(r => setSkills(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = s => { setForm({ name: s.name, category: s.category, proficiency: s.proficiency }); setEditId(s._id); setShowModal(true); };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.name) { showToast('Name is required'); return; }
    setSaving(true);
    try {
      if (editId) await api.put(`/skills/${editId}`, form);
      else await api.post('/skills', form);
      showToast(editId ? 'Skill updated!' : 'Skill added!');
      setShowModal(false); fetch();
    } catch (err) { showToast(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/skills/${id}`); showToast('Deleted'); setConfirmDelete(null); fetch(); }
    catch { showToast('Error deleting'); }
  };

  const grouped = {};
  skills.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });

  return (
    <AdminLayout title="Skills">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}
      <div className="admin-page-header">
        <h2>Manage Skills ({skills.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Skill</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        Object.entries(grouped).map(([cat, catSkills]) => (
          <div key={cat} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>{cat}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Skill</th><th>Proficiency</th><th>Actions</th></tr></thead>
                <tbody>
                  {catSkills.map(s => (
                    <tr key={s._id}>
                      <td><strong style={{ color: 'var(--text-primary)' }}>{s.name}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 3, maxWidth: 150 }}>
                            <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'var(--gradient)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontFamily: 'var(--font-mono)', minWidth: 36 }}>{s.proficiency}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-edit" onClick={() => openEdit(s)}><FiEdit2 size={13} /> Edit</button>
                          <button className="admin-btn-delete" onClick={() => setConfirmDelete(s._id)}><FiTrash2 size={13} /> Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {skills.length === 0 && !loading && (
        <div className="empty-state"><h3>No skills yet</h3><p>Add your technical skills to showcase them.</p></div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="admin-modal" style={{ maxWidth: 460 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Skill' : 'Add Skill'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Skill Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React.js" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Proficiency: {form.proficiency}%</label>
                  <input type="range" min={0} max={100} value={form.proficiency} onChange={e => setForm(p => ({ ...p, proficiency: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Skill'}
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
            <motion.div className="admin-modal" style={{ maxWidth: 380 }} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}>
              <h3 style={{ marginBottom: 12 }}>Delete Skill?</h3>
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

export default Skills;