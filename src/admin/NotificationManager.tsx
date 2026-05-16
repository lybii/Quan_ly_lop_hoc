import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Title } from '../components/Title';
import { Profile } from '../components/Profile';

interface Notification {
  id: number;
  title: string;
  content: string;
  status: number;
  userId: number;
  time?: string;
}

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

export const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

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

  // Fetch all notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Function to fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để xem danh sách thông báo');
        return;
      }

      // This is a placeholder endpoint - you'll need to implement it on the backend
      const response = await axios.get(
        'http://localhost:8080/api/notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải danh sách thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for notification targeting
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để xem danh sách người dùng');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    fetchUsers();
    setTitle('');
    setContent('');
    setSelectedUsers([]);
    setSelectAll(false);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (notification: Notification) => {
    fetchUsers();
    setSelectedNotification(notification);
    setTitle(notification.title);
    setContent(notification.content);
    setShowEditModal(true);
  };

  const handleSelectAllUsers = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleCreateNotification = async () => {
    if (!title || !content) {
      setError('Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Vui lòng chọn ít nhất một người dùng để gửi thông báo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // Step 1: Create a new notification
      const notificationResponse = await axios.post(
        'http://localhost:8080/api/notifications/add',
        {
          title,
          content,
          status: 1,
          userId: parseInt(userId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (notificationResponse.data) {
        const notificationId = notificationResponse.data.id;

        // Step 2: Create user notifications for selected users
        await axios.post(
          'http://localhost:8080/api/user-notifications/add',
          {
            notificationId,
            userIds: selectedUsers,
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSuccess('Thông báo đã được gửi thành công');
        setTitle('');
        setContent('');
        setSelectedUsers([]);
        setSelectAll(false);
        setShowCreateModal(false);

        // Refresh the notifications list
        fetchNotifications();

        // Wait 3 seconds and clear success message
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Không thể tạo thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotification = async () => {
    if (!selectedNotification) return;

    if (!title || !content) {
      setError('Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // Update the notification
      await axios.put(
        `http://localhost:8080/api/notifications/update/${selectedNotification.id}`,
        {
          title,
          content,
          status: selectedNotification.status,
          userId: selectedNotification.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Thông báo đã được cập nhật thành công');
      setShowEditModal(false);

      // Refresh the notifications list
      fetchNotifications();

      // Wait 3 seconds and clear success message
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating notification:', error);
      setError('Không thể cập nhật thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này không?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const response = await axios.delete(
        `http://localhost:8080/api/notifications/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Xóa thông báo thành công');

        // Update the notifications list
        setNotifications(notifications.filter((notif) => notif.id !== id));

        // Wait 3 seconds and clear success message
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Không thể xóa thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý thông báo" />

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

      {/* Success Message */}
      {success && (
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
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
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

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Tạo thông báo mới</h2>

            <div className="mb-4">
              <label className="mb-1 block font-medium">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border p-2"
                placeholder="Nhập tiêu đề thông báo"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block font-medium">Nội dung</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border p-2"
                rows={4}
                placeholder="Nhập nội dung thông báo"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="font-medium">Người nhận</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAllUsers}
                    className="mr-2"
                  />
                  <label htmlFor="select-all" className="text-sm">
                    Chọn tất cả
                  </label>
                </div>
              </div>

              <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border p-2">
                {loading ? (
                  <p className="py-2 text-center text-gray-500">Đang tải...</p>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`user-${user.id}`} className="text-sm">
                        {user.userName} - {user.email} (
                        {getRoleDisplayName(user.role.name)})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-center text-gray-500">
                    Không có người dùng nào
                  </p>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Đã chọn {selectedUsers.length} người dùng
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateNotification}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Gửi thông báo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notification Modal */}
      {showEditModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Chỉnh sửa thông báo</h2>

            <div className="mb-4">
              <label className="mb-1 block font-medium">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border p-2"
                placeholder="Nhập tiêu đề thông báo"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block font-medium">Nội dung</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border p-2"
                rows={4}
                placeholder="Nhập nội dung thông báo"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateNotification}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Cập nhật thông báo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="mt-4">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold">Danh sách thông báo</h2>
          <button
            onClick={handleOpenCreateModal}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Tạo thông báo mới
          </button>
        </div>

        {loading && !notifications.length ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            {/* Stats at the top */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-blue-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng thông báo</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {notifications.length}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-green-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Thông báo hoạt động</p>
                    <p className="text-2xl font-bold text-green-700">
                      {notifications.filter((n) => n.status === 1).length}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 text-green-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-red-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Thông báo không hoạt động
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {notifications.filter((n) => n.status === 0).length}
                    </p>
                  </div>
                  <div className="rounded-full bg-red-100 p-3 text-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-purple-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Thông báo gần đây</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {
                        notifications.filter(
                          (n) =>
                            n.time &&
                            new Date(n.time).getTime() > Date.now() - 86400000
                        ).length
                      }
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3 text-purple-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  className="rounded-lg border-2 border-gray-300 p-2"
                  onChange={(e) => {
                    // Simple search filtering could be implemented here
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <select className="rounded-lg border-2 border-gray-300 p-2">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md overflow-hidden text-ellipsis text-sm text-gray-500">
                            {notification.content}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              notification.status === 1
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {notification.status === 1
                              ? 'Hoạt động'
                              : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {notification.time
                            ? new Date(notification.time).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenEditModal(notification)}
                            className="mr-4 text-blue-600 hover:text-blue-900"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Không có thông báo nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">{notifications.length}</span>{' '}
                thông báo
              </div>
              <div className="flex justify-center space-x-1">
                <button className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Trước
                </button>
                <button className="rounded-md border border-blue-500 bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600">
                  1
                </button>
                <button className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
