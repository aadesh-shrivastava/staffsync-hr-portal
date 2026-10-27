import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Trainings from './pages/Trainings';
import Profile from './pages/Profile';

function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className="container py-4">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<Guard><Dashboard /></Guard>} />
          <Route path="/employees" element={<Guard roles={['hr', 'manager']}><Employees /></Guard>} />
          <Route path="/leaves" element={<Guard><Leaves /></Guard>} />
          <Route path="/attendance" element={<Guard><Attendance /></Guard>} />
          <Route path="/announcements" element={<Guard><Announcements /></Guard>} />
          <Route path="/trainings" element={<Guard><Trainings /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
