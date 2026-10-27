import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2' },
    ...(user.role !== 'employee' ? [{
      to: '/employees',
      label: user.role === 'hr' ? 'Employees' : 'My Team',
      icon: 'bi-people'
    }] : []),
    { to: '/leaves', label: 'Leaves', icon: 'bi-calendar2-check' },
    { to: '/attendance', label: 'Attendance', icon: 'bi-clock-history' },
    { to: '/announcements', label: 'Announcements', icon: 'bi-megaphone' },
    { to: '/trainings', label: 'Training', icon: 'bi-mortarboard' },
    { to: '/profile', label: 'Profile', icon: 'bi-person-circle' }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <NavLink to="/" className="navbar-brand brand text-decoration-none">
          <span className="brand-icon">
            <i className="bi bi-shield-check"></i>
          </span>
          <span className="text-white">Staff<span style={{ color: '#818cf8' }}>Sync</span></span>
        </NavLink>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#nv">
          <i className="bi bi-list text-white fs-3"></i>
        </button>

        <div className="collapse navbar-collapse" id="nv">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            {links.map(({ to, label, icon }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  end={to === '/'}
                  to={to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${icon}`}></i>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="user-badge">
              <div className="user-avatar-circle">
                {getInitials(user.name)}
              </div>
              <div className="d-flex flex-column lh-1">
                <span className="fw-semibold text-white small">{user.name}</span>
                <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {user.role}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
              title="Sign out"
              onClick={() => { logout(); nav('/login'); }}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
