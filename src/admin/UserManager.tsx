import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Profile } from '../components/Profile';

interface User {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  avatar: string;
  code: string;
  major: string;
  status: number;
  role: {
    id: number;
    name: string;
  };
}

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => (
  <h1 className="mb-4 text-3xl font-bold">{title}</h1>
);

interface SearchBoxProps {
  onSearch: (term: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => (
  <input
    type="text"
    placeholder="Tìm kiếm người dùng..."
    className="w-64 rounded-lg border-2 border-gray-300 p-2"
    onChange={(e) => onSearch(e.target.value)}
  />
);

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
}) => (
  <div className="flex items-center justify-between border-b p-4">
    <div>
      <p className="font-bold">{user.userName}</p>
      <p className="text-gray-600">{user.email}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{user.role.name}</span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            user.status === 1
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onToggleStatus(user.id, user.status)}
        className={`rounded-lg px-4 py-2 text-white ${
          user.status === 1
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {user.status === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
      </button>
      <button
        onClick={() => onEdit(user)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Sửa
      </button>
    </div>
  </div>
);

// Statistic card component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div className={`rounded-xl ${bgColor} p-4 shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`rounded-full ${bgColor} p-3`}>{icon}</div>
    </div>
  </div>
);

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [newUser, setNewUser] = useState<{
    userName: string;
    email: string;
    code: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    major: string;
    status: number;
    role: {
      id: number;
      name: string;
    };
  }>({
    userName: '',
    email: '',
    code: '',
    dateOfBirth: '',
    gender: 'MALE',
    phoneNumber: '',
    major: '',
    status: 1,
    role: {
      id: 1,
      name: 'ROLE_STUDENT',
    },
  });

  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Fetch all user types from API
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Bạn cần đăng nhập để xem danh sách người dùng.');
          setLoading(false);
          return;
        }

        // Fetch students
        const studentsResponse = await axios.get(
          'http://localhost:8080/api/users/students',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (studentsResponse.data.success) {
          setStudents(studentsResponse.data.data);
        }

        // Fetch lecturers
        const lecturersResponse = await axios.get(
          'http://localhost:8080/api/users/lecturers',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (lecturersResponse.data.success) {
          setTeachers(lecturersResponse.data.data);
        }

        // Fetch admins
        const adminsResponse = await axios.get(
          'http://localhost:8080/api/users/admins',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (adminsResponse.data.success) {
          setAdmins(adminsResponse.data.data);
        }

        // Combine all users
        const allUsers = [
          ...studentsResponse.data.data,
          ...lecturersResponse.data.data,
          ...adminsResponse.data.data,
        ];

        setUsers(allUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        let errorMsg =
          'Không thể tải danh sách người dùng. Vui lòng thử lại sau.';

        if (error.response) {
          if (error.response.status === 401) {
            errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Fetch current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === 'all' ||
      (selectedRole === 'ROLE_STUDENT' && user.role.name === 'ROLE_STUDENT') ||
      (selectedRole === 'ROLE_LECTURER' &&
        user.role.name === 'ROLE_LECTURER') ||
      (selectedRole === 'ROLE_ADMIN' && user.role.name === 'ROLE_ADMIN');

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.status === 1) ||
      (selectedStatus === 'inactive' && user.status === 0);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    if (!newUser.userName || !newUser.email) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc (tên và email)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/users',
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Thêm người dùng thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Reset form and refresh user list
        setNewUser({
          userName: '',
          email: '',
          code: '',
          dateOfBirth: '',
          gender: 'MALE',
          phoneNumber: '',
          major: '',
          status: 1,
          role: {
            id: 1,
            name: 'ROLE_STUDENT',
          },
        });
        setIsAdding(false);
        fetchAllUsers();
      } else {
        setError(response.data.message || 'Không thể thêm người dùng mới.');
      }
    } catch (error: any) {
      console.error('Error adding user:', error);
      let errorMsg = 'Không thể thêm người dùng mới. Vui lòng thử lại sau.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này.');
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${editUser.id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Cập nhật thông tin người dùng thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Refresh user list
        fetchAllUsers();
        setIsEditModalOpen(false);
      } else {
        setError(
          response.data.message || 'Không thể cập nhật thông tin người dùng.'
        );
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      let errorMsg =
        'Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này.');
        return;
      }

      const response = await axios.delete(
        `http://localhost:8080/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Xóa người dùng thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Refresh user list
        fetchAllUsers();
      } else {
        setError(response.data.message || 'Không thể xóa người dùng.');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      let errorMsg = 'Không thể xóa người dùng. Vui lòng thử lại sau.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${currentStatus === 1 ? 'vô hiệu hóa' : 'kích hoạt'} người dùng này không?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này.');
        return;
      }

      // Find the user to update
      const userToUpdate = users.find((user) => user.id === id);
      if (!userToUpdate) {
        setError('Không tìm thấy thông tin người dùng.');
        setLoading(false);
        return;
      }

      // Create updated user data with toggled status
      const updatedUser = {
        ...userToUpdate,
        status: currentStatus === 1 ? 0 : 1,
      };

      const response = await axios.put(
        `http://localhost:8080/api/users/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          `Người dùng đã được ${currentStatus === 1 ? 'vô hiệu hóa' : 'kích hoạt'} thành công!`
        );
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Refresh user list
        fetchAllUsers();
      } else {
        setError(
          response.data.message ||
            `Không thể ${currentStatus === 1 ? 'vô hiệu hóa' : 'kích hoạt'} người dùng.`
        );
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      let errorMsg = `Không thể ${currentStatus === 1 ? 'vô hiệu hóa' : 'kích hoạt'} người dùng. Vui lòng thử lại sau.`;

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Move fetchAllUsers to a named function that can be called for refreshing data
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để xem danh sách người dùng.');
        setLoading(false);
        return;
      }

      // Fetch students
      const studentsResponse = await axios.get(
        'http://localhost:8080/api/users/students',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (studentsResponse.data.success) {
        setStudents(studentsResponse.data.data);
      }

      // Fetch lecturers
      const lecturersResponse = await axios.get(
        'http://localhost:8080/api/users/lecturers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (lecturersResponse.data.success) {
        setTeachers(lecturersResponse.data.data);
      }

      // Fetch admins
      const adminsResponse = await axios.get(
        'http://localhost:8080/api/users/admins',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (adminsResponse.data.success) {
        setAdmins(adminsResponse.data.data);
      }

      // Combine all users
      const allUsers = [
        ...studentsResponse.data.data,
        ...lecturersResponse.data.data,
        ...adminsResponse.data.data,
      ];

      setUsers(allUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      let errorMsg =
        'Không thể tải danh sách người dùng. Vui lòng thử lại sau.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Use the fetchAllUsers function in useEffect
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === 1).length;
  const inactiveUsers = users.filter((user) => user.status === 0).length;
  const studentCount = students.length;
  const teacherCount = teachers.length;
  const adminCount = admins.length;

  // Calculate new users this month (based on available data)
  // Since we don't have createdAt field in the API response, this is a placeholder
  const newUsersThisMonth = 0;

  // Function to get role name in Vietnamese
  const getRoleDisplayName = (roleName: string): string => {
    switch (roleName) {
      case 'ROLE_ADMIN':
        return 'Quản trị viên';
      case 'ROLE_STUDENT':
        return 'Sinh viên';
      case 'ROLE_LECTURER':
        return 'Giảng viên';
      default:
        return roleName;
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý tài khoản" />

      <div className="-mt-8 flex justify-end">
        <div className="flex items-center gap-4">
          {userProfile && (
            <Profile
              name={userProfile.userName}
              role={getRoleDisplayName(userProfile.role.name)}
              image={userProfile.avatar || '../../src/assets/admin_avatar.png'}
            />
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">
              Cập nhật thông tin người dùng
            </h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={editUser.userName}
                    onChange={(e) =>
                      setEditUser({ ...editUser, userName: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã số
                  </label>
                  <input
                    type="text"
                    value={editUser.code}
                    onChange={(e) =>
                      setEditUser({ ...editUser, code: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={editUser.phoneNumber || ''}
                    onChange={(e) =>
                      setEditUser({ ...editUser, phoneNumber: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={
                      editUser.dateOfBirth
                        ? editUser.dateOfBirth.split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditUser({ ...editUser, dateOfBirth: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Giới tính
                  </label>
                  <select
                    value={editUser.gender}
                    onChange={(e) =>
                      setEditUser({ ...editUser, gender: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Chuyên ngành
                  </label>
                  <input
                    type="text"
                    value={editUser.major || ''}
                    onChange={(e) =>
                      setEditUser({ ...editUser, major: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={editUser.status}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        status: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border p-2"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && !users.length ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Đang tải dữ liệu người dùng...</p>
        </div>
      ) : (
        <>
          {/* Statistics Overview */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
              title="Tổng người dùng"
              value={totalUsers}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              }
              bgColor="bg-white"
              textColor="text-blue-600"
            />

            <StatCard
              title="Người dùng hoạt động"
              value={`${activeUsers} (${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%)`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              }
              bgColor="bg-white"
              textColor="text-green-600"
            />

            <StatCard
              title="Người dùng không hoạt động"
              value={inactiveUsers}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              }
              bgColor="bg-white"
              textColor="text-red-600"
            />

            <StatCard
              title="Sinh viên"
              value={studentCount}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-purple-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
              }
              bgColor="bg-white"
              textColor="text-purple-600"
            />
          </div>

          {/* User distribution */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">
                Phân bố người dùng theo vai trò
              </h2>
              <div className="flex h-[200px] items-end justify-around">
                <div className="flex w-1/3 flex-col items-center">
                  <div
                    className="mb-2 w-24 rounded-t-lg bg-blue-500"
                    style={{
                      height: `${totalUsers > 0 ? (studentCount / totalUsers) * 180 : 0}px`,
                    }}
                  ></div>
                  <div className="text-center">
                    <p className="font-bold">{studentCount}</p>
                    <p className="text-sm text-gray-500">Sinh viên</p>
                  </div>
                </div>
                <div className="flex w-1/3 flex-col items-center">
                  <div
                    className="mb-2 w-24 rounded-t-lg bg-green-500"
                    style={{
                      height: `${totalUsers > 0 ? (teacherCount / totalUsers) * 180 : 0}px`,
                    }}
                  ></div>
                  <div className="text-center">
                    <p className="font-bold">{teacherCount}</p>
                    <p className="text-sm text-gray-500">Giảng viên</p>
                  </div>
                </div>
                <div className="flex w-1/3 flex-col items-center">
                  <div
                    className="mb-2 w-24 rounded-t-lg bg-purple-500"
                    style={{
                      height: `${totalUsers > 0 ? (adminCount / totalUsers) * 180 : 0}px`,
                    }}
                  ></div>
                  <div className="text-center">
                    <p className="font-bold">{adminCount}</p>
                    <p className="text-sm text-gray-500">Admin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Trạng thái người dùng</h2>
              <div className="relative mx-auto h-[180px] w-[180px]">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {totalUsers > 0
                      ? Math.round((activeUsers / totalUsers) * 100)
                      : 0}
                    %
                  </span>
                  <span className="text-sm text-gray-500">Hoạt động</span>
                </div>
              </div>
              <div className="mt-4 flex justify-around">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Hoạt động</span>
                  </div>
                  <p className="font-bold">{activeUsers}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="mr-1 h-3 w-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm">Không hoạt động</span>
                  </div>
                  <p className="font-bold">{inactiveUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap gap-2">
              <SearchBox onSearch={handleSearch} />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="STUDENT">Sinh viên</option>
                <option value="LECTURER">Giảng viên</option>
                <option value="ADMIN">Admin</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  alert('Tải file excel chức năng đang phát triển')
                }
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Tải file excel
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Thêm người dùng
              </button>
            </div>
          </div>

          {isAdding && (
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
              <h2 className="mb-2 text-xl font-bold">Thêm người dùng mới</h2>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={newUser.userName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, userName: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã số
                  </label>
                  <input
                    type="text"
                    placeholder="Mã số"
                    value={newUser.code}
                    onChange={(e) =>
                      setNewUser({ ...newUser, code: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={newUser.phoneNumber}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phoneNumber: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) =>
                      setNewUser({ ...newUser, dateOfBirth: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Giới tính
                  </label>
                  <select
                    value={newUser.gender}
                    onChange={(e) =>
                      setNewUser({ ...newUser, gender: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Chuyên ngành
                  </label>
                  <input
                    type="text"
                    placeholder="Chuyên ngành"
                    value={newUser.major}
                    onChange={(e) =>
                      setNewUser({ ...newUser, major: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Vai trò
                  </label>
                  <select
                    value={newUser.role.name}
                    onChange={(e) => {
                      let roleId = 1;
                      if (e.target.value === 'ROLE_LECTURER') roleId = 2;
                      if (e.target.value === 'ROLE_ADMIN') roleId = 3;

                      setNewUser({
                        ...newUser,
                        role: {
                          id: roleId,
                          name: e.target.value,
                        },
                      });
                    }}
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  >
                    <option value="ROLE_STUDENT">Sinh viên</option>
                    <option value="ROLE_LECTURER">Giảng viên</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        status: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-2 border-gray-300 p-2"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleAddUser}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Lưu'}
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white shadow-lg">
            <div className="border-b p-4">
              <h2 className="text-lg font-bold">
                Danh sách người dùng ({filteredUsers.length})
              </h2>
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            ) : (
              <p className="p-4 text-gray-500">Không tìm thấy người dùng</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
