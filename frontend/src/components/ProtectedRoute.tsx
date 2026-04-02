import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUserRole } from '../services/auth';

interface ProtectedRouteProps {
  allowedRole?: 'student' | 'faculty';
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'faculty') {
      return <Navigate to="/faculty/dashboard" replace />;
    } else if (role === 'student') {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return <Navigate to={`/student/events/${userInfo.rollNumber}`} replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
