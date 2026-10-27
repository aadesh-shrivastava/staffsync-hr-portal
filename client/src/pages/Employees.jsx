import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg } from '../api';

const empty = { name: '', email: '', password: '', role: 'employee', department: '', position: '', phone: '', salary: 0, manager: '' };

export default function Employees() {
  const { user } = useAuth();
  const isHR = user.role === 'hr';
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null); // null = hidden
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api.get('/users').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const managers = list.filter((u) => u.role === 'manager');

  const edit = (u) => {
    setEditId(u._id);
    setForm({ ...empty, ...u, password: '', manager: u.manager?._id || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editId) await api.put(`/users/${editId}`, form);
      else await api.post('/users', form);
      setForm(null); setEditId(null); load();
    } catch (x) { setErr(errMsg(x)); }
  };

  const del = async (id) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try { await api.delete(`/users/${id}`); load(); } catch (x) { alert(errMsg(x)); }
  };

  const filtered = list.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.position && u.position.toLowerCase().includes(q))
    );
  });

  const exportCsv = () => {
    const columns = [
      ['Name', (u) => u.name],
      ['Email', (u) => u.email],
      ['Role', (u) => u.role],
      ['Department', (u) => u.department || ''],
      ['Position', (u) => u.position || ''],
      ['Manager', (u) => u.manager?.name || ''],
      ['Phone', (u) => u.phone || '']
    ];
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [
      columns.map(([label]) => escapeCsv(label)).join(','),
      ...filtered.map((member) => columns.map(([, value]) => escapeCsv(value(member))).join(','))
    ];
    const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staffsync-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'hr': return <span className="badge bg-primary">HR Admin</span>;
      case 'manager': return <span className="badge bg-warning">Manager</span>;
      default: return <span className="badge bg-secondary">Employee</span>;
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center page-header gap-3">
        <div>
          <h3 className="page-title">{isHR ? 'Staff Directory' : 'My Team Members'}</h3>
          <p className="page-subtitle mb-0">Manage personnel records, roles, departments and reporting hierarchy</p>
        </div>
        {isHR && (
          <button
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => { setEditId(null); setForm(empty); }}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {form && (
        <form className="card p-4 mb-4 border-primary border-opacity-25 shadow-sm" onSubmit={save}>
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h5 className="fw-bold mb-0">
              <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle-fill'} text-primary me-2`}></i>
              {editId ? 'Update Employee Record' : 'Register New Employee'}
            </h5>
            <button type="button" className="btn-close" onClick={() => setForm(null)}></button>
          </div>

          {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Full Name *</label>
              <input className="form-control" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Email Address *</label>
              <input type="email" className="form-control" placeholder="jane@staffsync.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">
                {editId ? 'New Password (leave blank to keep)' : 'Initial Password *'}
              </label>
              <input
                type="password"
                className="form-control"
                placeholder={editId ? '••••••••' : 'Min 6 characters'}
                minLength={6}
                value={form.password}
                onChange={set('password')}
                required={!editId}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Role</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR Admin</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Department</label>
              <input className="form-control" placeholder="Engineering, Sales, etc." value={form.department} onChange={set('department')} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Job Position</label>
              <input className="form-control" placeholder="Senior Developer" value={form.position} onChange={set('position')} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Phone Number</label>
              <input className="form-control" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Monthly Salary</label>
              <input type="number" className="form-control" placeholder="5000" value={form.salary} onChange={set('salary')} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Reporting Manager</label>
              <select className="form-select" value={form.manager} onChange={set('manager')}>
                <option value="">No manager assigned</option>
                {managers.map((m) => <option key={m._id} value={m._id}>{m.name} ({m.department || 'Management'})</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-2 border-top d-flex gap-2">
            <button className="btn btn-primary d-inline-flex align-items-center gap-1">
              <i className="bi bi-check-lg"></i>
              <span>{editId ? 'Save Changes' : 'Create Record'}</span>
            </button>
            <button type="button" className="btn btn-light border" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card shadow-sm overflow-hidden">
        <div className="p-3 border-bottom bg-white d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div className="position-relative" style={{ maxWidth: 320, width: '100%' }}>
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 py-2"
              placeholder="Search by name, role or dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small">Showing {filtered.length} member{filtered.length === 1 ? '' : 's'}</span>
            {isHR && (
              <button type="button" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2" onClick={exportCsv} disabled={filtered.length === 0}>
                <i className="bi bi-download"></i> Export CSV
              </button>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Position</th>
                <th>Manager</th>
                {isHR && <th className="text-end">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.85rem' }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{u.name}</div>
                        <div className="small text-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>{u.department || <span className="text-muted">-</span>}</td>
                  <td>{u.position || <span className="text-muted">-</span>}</td>
                  <td>
                    {u.manager?.name ? (
                      <span className="badge bg-secondary">{u.manager.name}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  {isHR && (
                    <td className="text-end text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-primary me-2 d-inline-flex align-items-center gap-1"
                        onClick={() => edit(u)}
                        title="Edit employee"
                      >
                        <i className="bi bi-pencil"></i>
                        <span className="d-none d-md-inline">Edit</span>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={() => del(u._id)}
                        title="Delete employee"
                      >
                        <i className="bi bi-trash3"></i>
                        <span className="d-none d-md-inline">Delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isHR ? 6 : 5} className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-1 d-block mb-2 text-black-50"></i>
                    No staff members found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
