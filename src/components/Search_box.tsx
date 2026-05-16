import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface SearchBoxProps {
  onSearch?: (value: string) => void;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  status: number;
  time?: string;
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Fetch notifications for the current user
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          return;
        }

        // Use the endpoint we just created
        const response = await axios.get(
          `http://localhost:8080/api/user-notifications/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setNotifications(response.data.data);
          // Count unread notifications (those with status = 1)
          const unreadCount = response.data.data.filter(
            (notif: Notification) => notif.status === 1
          ).length;
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up an interval to check for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCreateNotification = async () => {
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

        // Step 2: Get all user IDs to send notification to
        const usersResponse = await axios.get(
          'http://localhost:8080/api/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (usersResponse.data.success) {
          const userIds = usersResponse.data.data.map((user: any) => user.id);

          // Step 3: Create user notifications for all users
          await axios.post(
            'http://localhost:8080/api/user-notifications/add',
            {
              notificationId,
              userIds,
              time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          setSuccess('Thông báo đã được gửi đến tất cả người dùng');
          setTitle('');
          setContent('');
          setShowCreateModal(false);

          // Wait 3 seconds and clear success message
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Không thể tạo thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        return;
      }

      // Mark notification as read
      await axios.put(
        `http://localhost:8080/api/user-notifications/mark-as-read/${notificationId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to reflect the change
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: 0 }
            : notification
        )
      );

      // Update notification count
      setNotificationCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative mb-2 flex items-center justify-between">
      <input
        type="search"
        placeholder="Tìm kiếm"
        className="mb-2 mr-4 w-[500px] rounded-2xl border p-2"
        onChange={handleChange}
      />
      <div className="ml-96 flex items-center gap-2">
        {/* Notification Bell with Badge */}
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Email Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-10 z-10 max-h-96 w-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-bold">Thông báo</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            >
              Tạo thông báo mới
            </button>
          </div>

          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b p-3 hover:bg-gray-50 ${notification.status === 1 ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {notification.content}
                  </p>
                  {notification.time && (
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(notification.time).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có thông báo nào
            </div>
          )}

          <div className="border-t p-2 text-center">
            <button className="text-sm text-blue-500 hover:underline">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Tạo thông báo mới</h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-800">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-800">
                {success}
              </div>
            )}

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
    </div>
  );
}
