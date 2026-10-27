import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api, { errMsg, fmtTime } from '../api';

export default function Attendance() {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = () => {
    api.get('/attendance/mine').then((r) => setMine(r.data));
    if (user.role !== 'employee') {
      api.get('/attendance', { params: date ? { date } : {} }).then((r) => setAll(r.data));
    }
  };
  useEffect(load, [date]);

  const act = async (what) => {
    setMsg('');
    try {
      await api.post(`/attendance/${what}`);
      load();
    } catch (x) {
      setMsg(errMsg(x));
    }
  };

  const todayRecord = mine.find(
    (r) => r.date === new Date().toISOString().slice(0, 10)
  );

  return (
    <>
      <div className="page-header">
        <h3 className="page-title">Attendance Tracking</h3>
        <p className="page-subtitle mb-0">Record your daily work presence and view attendance records</p>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-7 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-primary"
                style={{ width: 54, height: 54, background: '#e0e7ff', fontSize: '1.5rem' }}
              >
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">Time & Attendance Clock</h5>
                <div className="text-muted small">
                  Live Clock: <strong className="text-dark">{currentTime}</strong>
                  {todayRecord?.checkIn && (
                    <span className="ms-2 badge bg-success">
                      Checked in at {fmtTime(todayRecord.checkIn)}
                    </span>
                  )}
                  {todayRecord?.checkOut && (
                    <span className="ms-2 badge bg-secondary">
                      Checked out at {fmtTime(todayRecord.checkOut)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-md-end">
            <div className="d-flex justify-content-md-end gap-2">
              <button
                className="btn btn-success d-inline-flex align-items-center gap-2"
                onClick={() => act('checkin')}
              >
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Check In</span>
              </button>
              <button
                className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
                onClick={() => act('checkout')}
              >
                <i className="bi bi-box-arrow-left"></i>
                <span>Check Out</span>
              </button>
            </div>
          </div>
        </div>

        {msg && (
          <div className="alert alert-danger py-2 mt-3 mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div>{msg}</div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-calendar3 text-primary"></i>
          My Attendance Records
        </h5>
        <div className="card shadow-sm table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((r) => (
                <tr key={r._id}>
                  <td className="fw-semibold">{r.date}</td>
                  <td>{fmtTime(r.checkIn)}</td>
                  <td>{fmtTime(r.checkOut)}</td>
                  <td>
                    <span className={`badge ${r.status === 'present' ? 'bg-success' : 'bg-warning'} text-capitalize`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {mine.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No attendance records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {user.role !== 'employee' && (
        <div className="mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-people-fill text-primary"></i>
              {user.role === 'hr' ? 'All Organization' : 'Team'} Attendance Log
            </h5>
            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted fw-semibold text-nowrap">Filter by Date:</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {date && (
                <button className="btn btn-sm btn-link text-decoration-none text-muted" onClick={() => setDate('')}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="card shadow-sm table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {all.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="fw-semibold text-dark">{r.employee?.name}</div>
                      <div className="small text-muted">{r.employee?.email}</div>
                    </td>
                    <td>{r.date}</td>
                    <td>{fmtTime(r.checkIn)}</td>
                    <td>{fmtTime(r.checkOut)}</td>
                    <td>
                      <span className={`badge ${r.status === 'present' ? 'bg-success' : 'bg-warning'} text-capitalize`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {all.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No attendance records found for this query.
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
