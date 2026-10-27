import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

const empty = { title: '', description: '', trainer: '', startDate: '', endDate: '', participants: [] };

export default function Trainings() {
  const { user } = useAuth();
  const canManage = user.role !== 'employee';
  const [list, setList] = useState([]);
  const [people, setPeople] = useState([]);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/trainings').then((r) => setList(r.data));
  useEffect(() => {
    load();
    if (canManage) api.get('/users').then((r) => setPeople(r.data.filter((u) => u.role === 'employee')));
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (id) =>
    setF({ ...f, participants: f.participants.includes(id) ? f.participants.filter((p) => p !== id) : [...f.participants, id] });

  const create = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await api.post('/trainings', f);
      setF(empty);
      load();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Are you sure you want to cancel and delete this training program?')) return;
    try {
      await api.delete(`/trainings/${id}`);
      load();
    } catch (x) {
      alert(errMsg(x));
    }
  };

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">Learning & Development</h3>
        <p className="page-subtitle mb-0">Upskill team capabilities with workshops, sessions, and certifications</p>
      </div>

      {canManage && (
        <div className="card p-4 mb-4 shadow-sm">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard text-primary"></i>
            Schedule New Training Program
          </h5>
          {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}
          <form onSubmit={create}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label small fw-semibold text-muted">Program Title *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Advanced TypeScript & Clean Architecture"
                  value={f.title}
                  onChange={set('title')}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">Instructor / Trainer</label>
                <input
                  className="form-control"
                  placeholder="e.g. Dr. Alex Vance"
                  value={f.trainer}
                  onChange={set('trainer')}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={f.startDate}
                  onChange={set('startDate')}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={f.endDate}
                  onChange={set('endDate')}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted">Description & Objectives</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Curriculum overview and prerequisites..."
                  value={f.description}
                  onChange={set('description')}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted d-block mb-2">Select Enrolled Employees</label>
                <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3 border">
                  {people.map((p) => {
                    const isChecked = f.participants.includes(p._id);
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => toggle(p._id)}
                        className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                          isChecked ? 'btn-primary' : 'btn-outline-secondary bg-white'
                        }`}
                        style={{ borderRadius: '20px' }}
                      >
                        <i className={`bi ${isChecked ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                        <span>{p.name}</span>
                        {p.department && <small className="opacity-75">({p.department})</small>}
                      </button>
                    );
                  })}
                  {people.length === 0 && <span className="text-muted small">No eligible employees listed.</span>}
                </div>
              </div>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={submitting}>
                {submitting && <span className="spinner-border spinner-border-sm" role="status"></span>}
                <i className="bi bi-calendar-event"></i>
                <span>Publish Program</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="row g-3">
        {list.map((t) => (
          <div className="col-lg-6" key={t._id}>
            <div className="card p-4 h-100 shadow-sm d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0 text-dark">{t.title}</h5>
                  {canManage && (
                    <button
                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                      onClick={() => del(t._id)}
                      title="Cancel Program"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center mb-3 small text-muted">
                  <span className="badge bg-primary">
                    <i className="bi bi-calendar-range me-1"></i>
                    {fmtDate(t.startDate)} → {fmtDate(t.endDate)}
                  </span>
                  {t.trainer && (
                    <span className="badge bg-secondary">
                      <i className="bi bi-person-badge me-1"></i>
                      Trainer: {t.trainer}
                    </span>
                  )}
                </div>

                {t.description && (
                  <p className="text-secondary small mb-3" style={{ lineHeight: '1.6' }}>
                    {t.description}
                  </p>
                )}
              </div>

              <div className="border-top pt-3 mt-2">
                <div className="small fw-semibold text-muted mb-2">
                  <i className="bi bi-people me-1"></i>
                  Enrolled Members ({t.participants?.length || 0})
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {t.participants?.map((p) => (
                    <span key={p._id} className="badge bg-light text-dark border">
                      {p.name}
                    </span>
                  ))}
                  {(!t.participants || t.participants.length === 0) && (
                    <span className="text-muted small">No participants assigned yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="col-12">
            <div className="card p-5 text-center text-muted shadow-sm">
              <i className="bi bi-mortarboard fs-1 d-block mb-2 text-black-50"></i>
              No active training programs scheduled.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
