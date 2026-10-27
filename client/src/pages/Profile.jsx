import { useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', password: '' });
  const [msg, setMsg] = useState({ ok: true, text: '' });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/me/profile', f);
      setUser(data);
      setF({ ...f, password: '' });
      setMsg({ ok: true, text: 'Profile information updated successfully!' });
    } catch (x) {
      setMsg({ ok: false, text: errMsg(x) });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">Personal Profile</h3>
        <p className="page-subtitle mb-0">Manage your personal details and account credentials</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card p-4 text-center shadow-sm">
            <div
              className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mb-3"
              style={{
                width: 80,
                height: 80,
                fontSize: '1.8rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)'
              }}
            >
              {getInitials(user.name)}
            </div>

            <h5 className="fw-bold mb-1 text-dark">{user.name}</h5>
            <div>
              <span className="badge bg-primary text-uppercase" style={{ letterSpacing: '0.04em' }}>
                {user.role}
              </span>
            </div>

            <hr className="my-4 text-muted" />

            <div className="text-start d-flex flex-column gap-3 small">
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-envelope-at text-primary fs-6"></i>
                <span className="text-truncate">{user.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-building text-primary fs-6"></i>
                <span>Department: {user.department || 'Not specified'}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-briefcase text-primary fs-6"></i>
                <span>Position: {user.position || 'Staff Member'}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary">
                <i className="bi bi-calendar-event text-primary fs-6"></i>
                <span>Joined: {fmtDate(user.joinDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <form className="card p-4 shadow-sm" onSubmit={save}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-pencil-square text-primary"></i>
              Edit Profile Details
            </h5>

            {msg.text && (
              <div className={`alert alert-${msg.ok ? 'success' : 'danger'} py-2 mb-3 d-flex align-items-center gap-2`}>
                <i className={`bi ${msg.ok ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`}></i>
                <div>{msg.text}</div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Full Name</label>
              <input className="form-control" placeholder="Full name" value={f.name} onChange={set('name')} required />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Phone Number</label>
              <input className="form-control" placeholder="+1 (555) 000-0000" value={f.phone} onChange={set('phone')} />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Mailing Address</label>
              <textarea className="form-control" rows="3" placeholder="Residential or mailing address" value={f.address} onChange={set('address')} />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">Change Password (leave empty to keep unchanged)</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password (optional)"
                minLength={6}
                value={f.password}
                onChange={set('password')}
              />
            </div>

            <button className="btn btn-primary d-inline-flex align-items-center gap-2 align-self-start" disabled={saving}>
              {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-check2-circle"></i>
              <span>Save Profile</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
