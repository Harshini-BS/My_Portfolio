// ===== ADMIN RESUME PAGE =====
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiDownload, FiTrash2, FiFileText } from 'react-icons/fi';
import AdminLayout from "../adminlayout/adminlayout.jsx";
import api, { getImageUrl } from "../utils/api.jsx";
const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetchResume = () => api.get('/resume').then(r => setResume(r.data.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchResume(); }, []);

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { showToast('Please upload a PDF file only.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      await api.post('/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Resume uploaded successfully!');
      fetchResume();
    } catch (err) { showToast('Upload failed. Please try again.'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete the current resume?')) return;
    try { await api.delete('/resume'); showToast('Resume deleted'); setResume(null); }
    catch { showToast('Error deleting'); }
  };

  return (
    <AdminLayout title="Resume Management">
      {toast && <div className={`toast toast-${toast.includes('failed') || toast.includes('Error') || toast.includes('PDF') ? 'error' : 'success'}`}>{toast}</div>}
      <div style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}><FiFileText style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
          <h2 style={{ marginBottom: 8 }}>Resume Management</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Upload your latest resume (PDF only, max 10MB)</p>

          {loading ? <div className="loader"><div className="spinner" /></div> : resume ? (
            <div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FiFileText size={24} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{resume.originalName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Uploaded: {new Date(resume.uploadedAt || resume.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={`${BACKEND_URL}${resume.path}`} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <FiDownload /> View Resume
                </a>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <FiUpload /> {uploading ? 'Uploading...' : 'Replace Resume'}
                  <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleUpload} />
                </label>
                <button className="btn btn-ghost" onClick={handleDelete} style={{ color: '#EF4444' }}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>No resume uploaded yet.</p>
              <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                <FiUpload /> {uploading ? 'Uploading...' : 'Upload Resume (PDF)'}
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Resume;