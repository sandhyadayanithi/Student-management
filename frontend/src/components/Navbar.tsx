import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuth, getToken, getUserRole, getUserInfo } from '../services/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const role = getUserRole();
  const userInfo = getUserInfo();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const isAuthPage = ['/', '/register', '/faculty/login', '/faculty/register'].includes(location.pathname);

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to={token ? (role === 'faculty' ? "/faculty/dashboard" : `/student/events/${userInfo?.rollNumber}`) : "/"} className="text-xl font-bold tracking-tight hover:text-indigo-200 transition">
              Student Event System
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <div className="text-sm font-medium mr-4">
                  <span className="opacity-75">{role === 'faculty' ? 'Faculty' : 'Student'}: </span>
                  <span className="font-semibold">{userInfo?.name || userInfo?.facultyName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800 transition shadow-sm border border-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/faculty/login"
                    className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition"
                  >
                    Faculty Login
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
