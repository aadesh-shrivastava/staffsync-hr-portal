import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

export default function Announcements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title: '', message: '', type: 'announcement' });
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/announcements').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const post = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await api.post('/announcements', f);
      setF({ title: '', message: '', type: 'announcement' });
      load();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await api.delete(`/announcements/${id}`);
      load();
    }
  };

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">Company Announcements</h3>
        <p className="page-subtitle mb-0">Stay informed with the latest company news and official circulars</p>
      </div>

      {user.role === 'hr' && (
        <div className="card p-4 mb-4 shadow-sm">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-broadcast text-primary"></i>
            Broadcast New Notice
          </h5>
          {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}
          <form onSubmit={post}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-semibold text-muted">Notice Title *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Annual Town Hall or Holiday Schedule"
                  value={f.title}
                  onChange={set('title')}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted">Category</label>
                <select className="form-select" value={f.type} onChange={set('type')}>
                  <option value="announcement">Announcement</option>
                  <option value="news">Company News</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted">Message Content *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter the complete bulletin details..."
                  value={f.message}
                  onChange={set('message')}
                  required
                />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={submitting}>
                {submitting && <span className="spinner-border spinner-border-sm" role="status"></span>}
                <i className="bi bi-megaphone-fill"></i>
                <span>Publish Notice</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {list.map((a) => (
          <div className="card p-4 shadow-sm" key={a._id}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-0 text-dark">{a.title}</h5>
                <span className={`badge ${a.type === 'news' ? 'bg-primary' : 'bg-warning'} text-capitalize`}>
                  {a.type}
                </span>
              </div>
              {user.role === 'hr' && (
                <button
                  className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                  onClick={() => del(a._id)}
                  title="Remove post"
                >
                  <i className="bi bi-trash3"></i>
                  <span>Delete</span>
                </button>
              )}
            </div>
            <p className="mb-3 text-secondary" style={{ lineHeight: '1.6' }}>{a.message}</p>
            <div className="d-flex align-items-center gap-3 text-muted small border-top pt-2">
              <span>
                <i className="bi bi-person-circle me-1"></i>
                Posted by {a.postedBy?.name || 'HR Team'}
              </span>
              <span>•</span>
              <span>
                <i className="bi bi-clock me-1"></i>
                {fmtDate(a.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="card p-5 text-center text-muted shadow-sm">
            <i className="bi bi-inbox fs-1 d-block mb-2 text-black-50"></i>
            No company announcements found.
          </div>
        )}
      </div>
    </>
  );
}
