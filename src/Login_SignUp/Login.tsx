import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      redirectBasedOnRole(role);
    }
  }, [navigate]);

  const redirectBasedOnRole = (role: string) => {
    console.log('Redirecting with role:', role);
    // Chuyển đổi role thành chữ hoa và thêm prefix nếu cần
    const normalizedRole = role.toUpperCase().startsWith('ROLE_') ? role : `ROLE_${role}`;
    console.log('Normalized role:', normalizedRole);

    switch (normalizedRole) {
      case 'ROLE_ADMIN':
        navigate('/admin');
        break;
      case 'ROLE_LECTURER':
        navigate('/lecturer');
        break;
      case 'ROLE_STUDENT':
        navigate('/student');
        break;
      default:
        console.error('Unknown role:', role);
        setError('Vai trò người dùng không hợp lệ');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      if (response.success) {
        // Nếu remember me được chọn, lưu email
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Lấy role từ response và chuyển hướng
        const role = response.data.role;
        console.log('User role from response:', role);
        redirectBasedOnRole(role);
        } else {
        setError(response.desc || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.desc || 
        error.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen bg-white flex'>
      <div className="w-1/2 h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-50 rounded shadow-xl">
          <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='w-1/2 h-screen flex justify-center items-center'>
        <img className='' src="../src/assets/edu-learn.jpg" alt="Logo" />
      </div>
    </div>
  );
}

export default Login;
