import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMail } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch = () => api.get('/messages').then(r => setMessages(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const handleOpen = async msg => {
    setSelected(msg);
    if (!msg.read) {
      try { await api.put(`/messages/${msg._id}/read`); fetch(); } catch {}
    }
  };

  const handleDelete = async id => {
    try { await api.delete(`/messages/${id}`); showToast('Message deleted'); setSelected(null); fetch(); }
    catch { showToast('Error deleting'); }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <AdminLayout title="Messages">
      {toast && <div className={`toast toast-${toast.includes('Error') ? 'error' : 'success'}`}>{toast}</div>}

      <div className="admin-page-header">
        <h2>Messages ({messages.length}){unread > 0 && <span className="badge badge-primary" style={{ marginLeft: 10 }}>{unread} unread</span>}</h2>
      </div>

      {loading ? <div className="loader"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Status</th><th>From</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No messages yet.</td></tr>
                ) : messages.map(msg => (
                  <tr
                    key={msg._id}
                    onClick={() => handleOpen(msg)}
                    style={{ cursor: 'pointer', background: selected?._id === msg._id ? 'var(--bg-secondary)' : undefined }}
                  >
                    <td>{<FiMail size={15} color={msg.read ? 'var(--text-muted)' : 'var(--primary-light)'} />}</td>
                    <td>
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: msg.read ? 400 : 700 }}>{msg.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{msg.email}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: msg.read ? 400 : 600, color: msg.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{msg.subject}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="admin-btn-delete" onClick={() => handleDelete(msg._id)}><FiTrash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ padding: 28, height: 'fit-content' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1rem' }}>{selected.subject}</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '0.85rem' }}><strong>From:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selected.name}</span></div>
                <div style={{ fontSize: '0.85rem' }}><strong>Email:</strong> <a href={`mailto:${selected.email}`} style={{ color: 'var(--primary-light)' }}>{selected.email}</a></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(selected.createdAt).toLocaleString()}</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{selected.message}</p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  <FiMail size={14} /> Reply
                </a>
                <button className="btn btn-ghost" onClick={() => handleDelete(selected._id)} style={{ color: '#EF4444', fontSize: '0.85rem' }}>
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;