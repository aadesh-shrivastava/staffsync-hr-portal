import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtDate } from '../api';

const badgeColors = {
  pending: 'bg-warning',
  approved: 'bg-success',
  rejected: 'bg-danger'
};

const badgeIcons = {
  pending: 'bi-hourglass-split',
  approved: 'bi-check-circle-fill',
  rejected: 'bi-x-circle-fill'
};

export default function Leaves() {
  const { user } = useAuth();
  const canReview = user.role !== 'employee';
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [f, setF] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get('/leaves/mine').then((r) => setMine(r.data));
    if (canReview) api.get('/leaves').then((r) => setAll(r.data));
  };
  useEffect(load, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const apply = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await api.post('/leaves', f);
      setF({ type: 'casual', startDate: '', endDate: '', reason: '' });
      load();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSubmitting(false);
    }
  };

  const review = async (id, status) => {
    const comment = status === 'rejected' ? prompt('Reason for rejection (optional)') || '' : '';
    try {
      await api.put(`/leaves/${id}/status`, { status, comment });
      load();
    } catch (x) {
      alert(errMsg(x));
    }
  };

  const renderStatus = (status) => (
    <span className={`badge ${badgeColors[status] || 'bg-secondary'} d-inline-flex align-items-center gap-1`}>
      <i className={`bi ${badgeIcons[status] || 'bi-circle'}`}></i>
      <span className="text-capitalize">{status}</span>
    </span>
  );

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">Leave Management</h3>
        <p className="page-subtitle mb-0">Submit time-off requests and track approval statuses</p>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-calendar-plus text-primary"></i>
          Request Time Off
        </h5>
        {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}
        <form onSubmit={apply}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Leave Type</label>
              <select className="form-select" value={f.type} onChange={set('type')}>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Start Date</label>
              <input type="date" className="form-control" value={f.startDate} onChange={set('startDate')} required />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">End Date</label>
              <input type="date" className="form-control" value={f.endDate} onChange={set('endDate')} required />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Reason</label>
              <input className="form-control" placeholder="Brief note / reason..." value={f.reason} onChange={set('reason')} />
            </div>
          </div>
          <div className="mt-3 text-end">
            <button className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={submitting}>
              {submitting && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-send-fill"></i>
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>

      <div className="mb-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-primary"></i>
          My Leave History
        </h5>
        <div className="card shadow-sm table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Manager Comment</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((r) => (
                <tr key={r._id}>
                  <td><span className="fw-semibold text-capitalize">{r.type}</span></td>
                  <td>{fmtDate(r.startDate)}</td>
                  <td>{fmtDate(r.endDate)}</td>
                  <td>{r.reason || <span className="text-muted">-</span>}</td>
                  <td>{renderStatus(r.status)}</td>
                  <td>{r.comment || <span className="text-muted">-</span>}</td>
                </tr>
              ))}
              {mine.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No leave requests submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {canReview && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-primary"></i>
              Team Leave Requests to Review
            </h5>
            <span className="badge bg-secondary">{all.filter(x => x.status === 'pending').length} pending</span>
          </div>
          <div className="card shadow-sm table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {all.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="fw-semibold text-dark">{r.employee?.name}</div>
                      <div className="small text-muted">{r.employee?.email}</div>
                    </td>
                    <td><span className="fw-semibold text-capitalize">{r.type}</span></td>
                    <td>{fmtDate(r.startDate)}</td>
                    <td>{fmtDate(r.endDate)}</td>
                    <td>{r.reason || <span className="text-muted">-</span>}</td>
                    <td>{renderStatus(r.status)}</td>
                    <td>{r.comment || <span className="text-muted">-</span>}</td>
                    <td className="text-end text-nowrap">
                      {r.status === 'pending' ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                            onClick={() => review(r._id, 'approved')}
                          >
                            <i className="bi bi-check-lg"></i>
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                            onClick={() => review(r._id, 'rejected')}
                          >
                            <i className="bi bi-x-lg"></i>
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {all.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No review requests at this time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
