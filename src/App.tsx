import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ReactNode } from 'react';
import Login from './Login_SignUp/Login';
import AdminRoutes from './routes/Admin_routes';
import TeacherRoutes from './routes/Teacher_routes';
import StudentRoutes from './routes/Student_routes';
import Sidebar from './components/sidebar/Sidebar';
import AdminSidebar from './components/sidebar/Admin_sidebar';
import TeacherSidebar from './components/sidebar/Teacher_sidebar';

// Protected Route component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  console.log('ProtectedRoute - Current Role:', userRole);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

  if (!token) {
    console.log('ProtectedRoute - No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole) {
    const normalizedUserRole = userRole.toUpperCase().replace('ROLE_', '');

    const hasAccess = allowedRoles.some((role) => {
      const normalizedRole = role.toUpperCase().replace('ROLE_', '');
      return normalizedRole === normalizedUserRole;
    });

    if (!hasAccess) {
      console.log(
        'ProtectedRoute - Role not allowed, redirecting to unauthorized'
      );
      console.log('User Role (normalized):', normalizedUserRole);
      console.log('Allowed Roles:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ADMIN']}>
              <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
                <AdminSidebar />
                <div className="flex-1 overflow-auto p-4">
                  <AdminRoutes />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/lecturer/*"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LECTURER', 'LECTURER']}>
              <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
                <TeacherSidebar />
                <div className="flex-1 overflow-auto p-4">
                  <TeacherRoutes />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'STUDENT']}>
              <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <StudentRoutes />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized route */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-red-600">
                  Unauthorized Access
                </h1>
                <p className="text-gray-600">
                  You don't have permission to access this page.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Quay lại
                </button>
              </div>
            </div>
          }
        />

        {/* 404 route */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-800">
                  404 Not Found
                </h1>
                <p className="text-gray-600">
                  The page you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Quay lại
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
