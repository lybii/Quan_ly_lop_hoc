import api from '../api/axiosConfig';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Raw API Response:', response);

      const data = response.data;
      console.log('Processed API Response:', data);

      if (data.success) {
        const role = data.data.role;
        // Thêm prefix ROLE_ nếu chưa có
        const normalizedRole = role.toUpperCase().startsWith('ROLE_')
          ? role
          : `ROLE_${role}`;

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userId', data.data.userId.toString());
        localStorage.setItem('role', normalizedRole);
      }
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Add API call if needed
      // await api.post('/auth/logout');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
