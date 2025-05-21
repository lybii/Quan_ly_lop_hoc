import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call logout API if needed
        await authService.logout();

        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg">Đang đăng xuất...</div>
    </div>
  );
};

export default Logout;
