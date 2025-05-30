import { useState, useEffect } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Interface NotificationProps
interface NotificationProps {
  id?: number;
  message: string;
  date: string;
  title: string;
  content?: string;
  status?: number;
  userId?: number;
  time?: string;
}

// Interfaces for API data
interface Student {
  id: number;
  user: {
    id: number;
    userName: string;
    email: string;
    code: string;
    status: number;
  };
  classId: number;
}

interface Class {
  id: number;
  classCode: string;
  type: string;
  count: number;
  status: number;
  course: {
    id: number;
    courseName: string;
    description: string;
    courseCode: string;
    credits: number;
    status: number;
  };
  students: Student[];
  lecturers: any[];
}

// Modal Component để tạo thông báo
interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (notification: NotificationProps) => void;
  currentClass?: Class;
  editingNotification?: NotificationProps | null;
}

// Delete Confirmation Modal
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Xác nhận xóa</h2>
        <p className="mb-6">Bạn có chắc chắn muốn xóa thông báo này?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  currentClass,
  editingNotification,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingNotification) {
        setTitle(editingNotification.title);
        setContent(editingNotification.content || editingNotification.message);
        if (editingNotification.time) {
          // Convert to format expected by datetime-local input
          const date = new Date(editingNotification.time);
          setTime(date.toISOString().slice(0, 16));
        }
      } else {
        setTitle('');
        setContent('');
        setTime('');
      }

      if (currentClass) {
        setStudents(currentClass.students || []);
      }
    }
  }, [isOpen, currentClass, editingNotification]);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo!');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      let notificationId;

      // If editing an existing notification
      if (editingNotification?.id) {
        const updateResponse = await axios.put(
          `http://localhost:8080/api/notifications/update/${editingNotification.id}`,
          {
            title,
            content,
            status: editingNotification.status || 1,
            userId: parseInt(userId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (updateResponse.status !== 200) {
          throw new Error('Cập nhật thông báo thất bại');
        }

        notificationId = editingNotification.id;

        // Format the date for UI display
        const dateForDisplay = time
          ? formatDateForDisplay(new Date(time))
          : editingNotification.date;

        // Create a notification object for UI display
        const notificationForUI: NotificationProps = {
          id: notificationId,
          title,
          message: content,
          date: dateForDisplay,
          content,
          status: editingNotification.status,
          userId: parseInt(userId),
          time: time || editingNotification.time,
        };

        onCreate(notificationForUI);
        setTitle('');
        setContent('');
        setTime('');
        onClose();
        alert('Đã cập nhật thông báo thành công!');
      } else {
        // Creating a new notification
        if (!currentClass) {
          alert('Không tìm thấy thông tin lớp học!');
          return;
        }

        // 1. Create notification
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

        if (!notificationResponse.data || !notificationResponse.data.id) {
          throw new Error('Tạo thông báo thất bại');
        }

        notificationId = notificationResponse.data.id;

        // 2. Send notification to all students in the class
        const studentUserIds = students.map((student) => student.user.id);

        if (studentUserIds.length > 0) {
          await axios.post(
            'http://localhost:8080/api/user-notifications/add',
            {
              notificationId,
              userIds: studentUserIds,
              time: time
                ? new Date(time)
                    .toISOString()
                    .replace('T', ' ')
                    .substring(0, 19)
                : new Date().toISOString().replace('T', ' ').substring(0, 19),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          // Format the date for UI display
          const dateForDisplay = time
            ? formatDateForDisplay(new Date(time))
            : formatDateForDisplay(new Date());

          // Create a notification object for UI display
          const notificationForUI: NotificationProps = {
            id: notificationId,
            title,
            message: content,
            date: dateForDisplay,
            content,
            status: 1,
            userId: parseInt(userId),
            time: time
              ? new Date(time).toISOString()
              : new Date().toISOString(),
          };

          onCreate(notificationForUI);
          setTitle('');
          setContent('');
          setTime('');
          onClose();
          alert('Đã gửi thông báo thành công!');
        } else {
          alert('Không có sinh viên nào trong lớp để gửi thông báo');
        }
      }
    } catch (error: any) {
      console.error('Error with notification:', error);
      setError(error.message || 'Đã xảy ra lỗi khi thực hiện thao tác');
      alert('Đã xảy ra lỗi: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/2 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">
          {editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        </h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-2 text-red-600">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {currentClass && !editingNotification && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="font-medium">
                Gửi thông báo đến lớp:{' '}
                <span className="text-blue-700">{currentClass.classCode}</span>{' '}
                - {currentClass.course.courseName}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Số sinh viên sẽ nhận thông báo: {students.length}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập tiêu đề"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập nội dung thông báo"
              rows={4}
              disabled={loading}
            />
          </div>
          {!editingNotification && (
            <div>
              <label className="block text-sm font-medium">Thời gian gửi</label>
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Thời gian gửi thông báo"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Nếu không chọn, thông báo sẽ được gửi ngay lập tức
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading
              ? 'Đang xử lý...'
              : editingNotification
                ? 'Cập nhật'
                : 'Gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
};

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

const Notification: React.FC<{
  notification: NotificationProps;
  onEdit: (notification: NotificationProps) => void;
  onDelete: (id: number) => void;
}> = ({ notification, onEdit, onDelete }) => {
  const dayofWeek = parseDate(notification.date).getDay();
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const day = days[dayofWeek];

  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h1 className="my-auto text-xl font-semibold">
          {day}, ngày {notification.date}
        </h1>
        <p className="my-auto text-sm font-normal">
          Thông báo:
          <p className="ml-1 inline text-sm font-medium text-red-500">
            {notification.title}
          </p>
        </p>
      </div>
      <p className="mx-auto">{notification.message}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-2 flex items-center space-x-2">
          <button
            onClick={() => onEdit(notification)}
            className="rounded-full p-1 text-blue-600 hover:bg-blue-100"
            title="Chỉnh sửa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            onClick={() => notification.id && onDelete(notification.id)}
            className="rounded-full p-1 text-red-600 hover:bg-red-100"
            title="Xóa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <div className="ml-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="ml-2 inline text-sm">{notification.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationList: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [editingNotification, setEditingNotification] =
    useState<NotificationProps | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Bạn cần đăng nhập để sử dụng tính năng này');
        return;
      }

      // Fetch user profile
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.success) {
        setUser(userResponse.data.data);
      }

      // Fetch current class details
      if (classId) {
        const classResponse = await axios.get(
          `http://localhost:8080/api/classes/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (classResponse.data.success) {
          setCurrentClass(classResponse.data.data);
        } else {
          setError('Không thể tải thông tin lớp học');
        }
      } else {
        setError('Không tìm thấy ID lớp học');
      }

      // Fetch notifications
      const notificationsResponse = await axios.get(
        'http://localhost:8080/api/notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (notificationsResponse.data.success) {
        const notificationsData = notificationsResponse.data.data || [];
        const formattedNotifications = notificationsData.map(
          (notification: any) => ({
            id: notification.id,
            title: notification.title,
            message: notification.content,
            content: notification.content,
            date: formatDateFromAPI(
              notification.time || new Date().toISOString()
            ),
            status: notification.status,
            userId: notification.userId,
            time: notification.time,
          })
        );
        setNotifications(formattedNotifications);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  const formatDateFromAPI = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleCreateOrUpdateNotification = (
    notification: NotificationProps
  ) => {
    if (editingNotification) {
      // Update existing notification in the list
      setNotifications(
        notifications.map((n) => (n.id === notification.id ? notification : n))
      );
      setEditingNotification(null);
    } else {
      // Add new notification to the list
      setNotifications([notification, ...notifications]);
    }
  };

  const handleEditNotification = (notification: NotificationProps) => {
    setEditingNotification(notification);
    setIsModalOpen(true);
  };

  const handleDeleteNotification = (id: number) => {
    setSelectedNotificationId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteNotification = async () => {
    if (!selectedNotificationId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      // First delete all user notifications associated with this notification
      await axios.delete(
        `http://localhost:8080/api/user-notifications/delete-by-notification/${selectedNotificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Then delete the notification itself
      await axios.delete(
        `http://localhost:8080/api/notifications/delete/${selectedNotificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the UI
      setNotifications(
        notifications.filter((n) => n.id !== selectedNotificationId)
      );
      setIsDeleteModalOpen(false);
      setSelectedNotificationId(null);
      alert('Đã xóa thông báo thành công');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      setError('Đã xảy ra lỗi khi xóa thông báo');
      alert(
        'Đã xảy ra lỗi khi xóa thông báo: ' +
          (error.message || 'Lỗi không xác định')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông báo lớp học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={() => {}} />
        <div className="flex">
          {user ? (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../src/assets/avatar.png'}
            />
          ) : (
            <Profile
              name="Giảng viên"
              role="LECTURER"
              image="../../src/assets/avatar.png"
            />
          )}
        </div>
      </div>
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        {currentClass && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4">
            <h2 className="text-lg font-semibold">
              Lớp học: {currentClass.classCode} -{' '}
              {currentClass.course.courseName}
            </h2>
            <p className="text-sm text-gray-600">
              Loại lớp: {currentClass.type}
            </p>
            <p className="text-sm text-gray-600">
              Số sinh viên: {currentClass.students?.length || 0}
            </p>
          </div>
        )}

        <div className="flex w-full justify-end">
          <button
            onClick={() => {
              setEditingNotification(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            disabled={loading || !currentClass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tạo thông báo cho lớp học
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onEdit={handleEditNotification}
              onDelete={handleDeleteNotification}
            />
          ))
        ) : (
          <div className="mt-8 text-center text-gray-500">
            Không có thông báo nào.
          </div>
        )}
      </div>

      <CreateNotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNotification(null);
        }}
        onCreate={handleCreateOrUpdateNotification}
        currentClass={currentClass || undefined}
        editingNotification={editingNotification}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteNotification}
      />
    </div>
  );
};
