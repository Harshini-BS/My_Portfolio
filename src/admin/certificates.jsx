import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const EMPTY = { title: '', organization: '', date: '', credentialUrl: '' };

const Certificates = () => {
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
  const fetch = () => api.get('/certificates').then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setImageFile(null); setShowModal(true); };
  const openEdit = item => {
    setForm({ title: item.title, organization: item.organization, date: item.date || '', credentialUrl: item.credentialUrl || '' });
    setEditId(item._id); setImageFile(null); setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.title || !form.organization) { showToast('Title and organization are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) await api.put(`/certificates/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast(editId ? 'Updated!' : 'Certificate added!');
      setShowModal(false); fetch();
    } catch (err) { showToast('Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/certificates/${id}`); showToast('Deleted'); setConfirmDelete(null); fetch(); }
    catch { showToast('Error deleting'); }
  };

  return (
    <AdminLayout title="Certificates">
      {toast && <div className={`toast toast-${toast.includes('Error') || toast.includes('required') ? 'error' : 'success'}`}>{toast}</div>}
      <div className="admin-page-header">
        <h2>Manage Certificates ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Certificate</button>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Title</th><th>Organization</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No certificates yet.</td></tr>
              ) : items.map(item => (
                <tr key={item._id}>
                  <td>{item.image ? <img src={getImageUrl(item.image)} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} /> : '–'}</td>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong></td>
                  <td>{item.organization}</td>
                  <td>{item.date || '–'}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-edit" onClick={() => openEdit(item)}><FiEdit2 size={13} /> Edit</button>
                      <button className="admin-btn-delete" onClick={() => setConfirmDelete(item._id)}><FiTrash2 size={13} /> Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="admin-modal" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h3>{editId ? 'Edit Certificate' : 'Add Certificate'}</h3>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Certificate Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AWS Cloud Practitioner" />
                </div>
                <div className="form-group">
                  <label className="form-label">Issuing Organization *</label>
                  <input className="form-input" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="e.g. Amazon Web Services" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. June 2024" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certificate Image</label>
                    <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '8px 12px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Credential URL</label>
                  <input className="form-input" value={form.credentialUrl} onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Certificate'}
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
              <h3 style={{ marginBottom: 12 }}>Delete Certificate?</h3>
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

export default Certificates;