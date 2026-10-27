import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { fmtDate } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((r) => setNews(r.data.slice(0, 5)));
    (async () => {
      if (user.role === 'employee') {
        const [l, a] = await Promise.all([api.get('/leaves/mine'), api.get('/attendance/mine')]);
        setStats([
          { label: 'My Pending Leaves', n: l.data.filter((x) => x.status === 'pending').length, icon: 'bi-hourglass-split', color: '#f59e0b' },
          { label: 'Approved Leaves', n: l.data.filter((x) => x.status === 'approved').length, icon: 'bi-check2-circle', color: '#10b981' },
          { label: 'Days Present', n: a.data.length, icon: 'bi-calendar2-check', color: '#4f46e5' }
        ]);
      } else {
        const [u, l] = await Promise.all([api.get('/users'), api.get('/leaves')]);
        setStats([
          { label: user.role === 'hr' ? 'Total Employees' : 'Team Members', n: u.data.length, icon: 'bi-people-fill', color: '#4f46e5' },
          { label: 'Pending Leave Requests', n: l.data.filter((x) => x.status === 'pending').length, icon: 'bi-hourglass-split', color: '#f59e0b' },
          { label: 'Total Leave Requests', n: l.data.length, icon: 'bi-file-earmark-text', color: '#6366f1' }
        ]);
      }
    })();
  }, [user]);

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className="card border-0 mb-4 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', borderRadius: '18px' }}>
        <div className="p-4 p-md-5 position-relative">
          <div className="position-relative" style={{ zIndex: 1 }}>
            <span className="badge bg-light text-white mb-2 text-uppercase" style={{ letterSpacing: '0.06em' }}>
              {user.role} Workspace
            </span>
            <h2 className="fw-bold mb-1">Hello, {user.name} 👋</h2>
            <p className="mb-0 text-white-50" style={{ fontSize: '0.95rem' }}>
              Today is {todayStr} • Here is your daily team overview
            </p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map(({ label, n, icon, color }) => (
          <div className="col-md-4" key={label}>
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{label}</div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: 48, height: 48, background: `${color}15`, color: color, fontSize: '1.4rem' }}
                >
                  <i className={`bi ${icon}`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-megaphone text-primary"></i>
            Latest Announcements & Updates
          </h5>
          <span className="badge bg-secondary">{news.length} updates</span>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-chat-square-text fs-2 d-block mb-2 text-black-50"></i>
            No announcements published yet.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {news.map((n) => (
              <div
                key={n._id}
                className="p-3 rounded-3"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark">{n.title}</span>
                  <span className={`badge ${n.type === 'news' ? 'bg-primary' : 'bg-warning'} text-capitalize`}>
                    {n.type}
                  </span>
                </div>
                <p className="text-muted mb-2 small" style={{ lineHeight: '1.5' }}>{n.message}</p>
                <div className="small text-muted d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3"></i>
                  <span>{fmtDate(n.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
