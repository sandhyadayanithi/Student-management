import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import FacultyLogin from './pages/FacultyLogin';
import FacultyRegister from './pages/FacultyRegister';
import Events from './pages/Events';
import FacultyDashboard from './pages/FacultyDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentLogin />} />
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/faculty/login" element={<FacultyLogin />} />
      <Route path="/faculty/register" element={<FacultyRegister />} />

      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student/events/:rollNumber" element={<Events />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="faculty" />}>
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      </Route>

      <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-bold">Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
