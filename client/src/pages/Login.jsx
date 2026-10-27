import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login, register } = useAuth();
  const [isReg, setIsReg] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (isReg) await register(f.name, f.email, f.password);
      else await login(f.email, f.password);
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setIsReg(false);
    setF({ name: '', email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center brand-icon mb-2" style={{ width: 44, height: 44, fontSize: '1.4rem' }}>
              <i className="bi bi-shield-check"></i>
            </div>
            <h3 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>StaffSync</h3>
            <p className="text-muted small mb-0">
              {isReg ? 'Create your employee account' : 'Sign in to access your HR workspace'}
            </p>
          </div>

          {err && (
            <div className="alert alert-danger py-2 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              <div>{err}</div>
            </div>
          )}

          <form onSubmit={submit}>
            {isReg && (
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
                  <input
                    className="form-control border-start-0 ps-0"
                    placeholder="Jane Doe"
                    value={f.name}
                    onChange={set('name')}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Work Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@staffsync.com"
                  value={f.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  minLength={6}
                  value={f.password}
                  onChange={set('password')}
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <span>{isReg ? 'Create Account' : 'Sign In'}</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none small text-muted"
              onClick={() => { setIsReg(!isReg); setErr(''); }}
            >
              {isReg ? 'Already registered? Sign in' : 'New employee? Register here'}
            </button>
          </div>

          {!isReg && (
            <div className="mt-4 pt-3 border-top">
              <div className="small fw-semibold text-muted mb-2 text-center">Quick Demo Access</div>
              <div className="d-flex flex-column gap-1">
                <button
                  type="button"
                  className="demo-account-chip d-flex justify-content-between align-items-center"
                  onClick={() => fillDemo('hr@staffsync.com', 'hr1234')}
                >
                  <span><strong>HR Admin:</strong> hr@staffsync.com</span>
                  <span className="badge bg-primary">Auto-fill</span>
                </button>
                <button
                  type="button"
                  className="demo-account-chip d-flex justify-content-between align-items-center"
                  onClick={() => fillDemo('manager@staffsync.com', 'mgr1234')}
                >
                  <span><strong>Manager:</strong> manager@staffsync.com</span>
                  <span className="badge bg-primary">Auto-fill</span>
                </button>
                <button
                  type="button"
                  className="demo-account-chip d-flex justify-content-between align-items-center"
                  onClick={() => fillDemo('employee@staffsync.com', 'emp1234')}
                >
                  <span><strong>Employee:</strong> employee@staffsync.com</span>
                  <span className="badge bg-primary">Auto-fill</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
