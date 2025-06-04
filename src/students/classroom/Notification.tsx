import { useState, useEffect } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface NotificationProps {
  id?: number;
  message: string;
  date: string;
  title: string;
  content?: string;
}

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  date,
  title,
}) => {
  const dayofWeek = parseDate(date).getDay();

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
          {day}, ngày {date}
        </h1>
        <p className="my-auto text-sm font-normal">
          Thông báo:
          <p className="ml-1 inline text-sm font-medium text-red-500">
            {title}
          </p>
        </p>
      </div>
      <p className="mx-auto">{message}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-2 flex items-center">
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

          <p className="ml-2 inline text-sm">{date}</p>
        </div>
      </div>
    </div>
  );
};

export const NotificationList: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Function to format date from API
  const formatDateFromAPI = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Fetch data
  useEffect(() => {
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

        // Fetch class info if classId is available
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
            setClassInfo(classResponse.data.data);
          } else {
            setError('Không thể tải thông tin lớp học');
          }

          // Fetch notifications for this specific class
          const notificationsResponse = await axios.get(
            `http://localhost:8080/api/notifications/class/${classId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // API directly returns an array of notifications
          const notificationsData = notificationsResponse.data || [];
          const formattedNotifications = notificationsData.map(
            (notification: any) => ({
              id: notification.id,
              title: notification.title,
              message: notification.content,
              content: notification.content,
              date: notification.time
                ? formatDateFromAPI(notification.time)
                : formatDateFromAPI(new Date().toISOString()),
            })
          );
          setNotifications(formattedNotifications);
        } else {
          setError('Không tìm thấy ID lớp học');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông báo" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={handleSearch} />
        <div className="flex">
          {user ? (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../src/assets/avatar.png'}
            />
          ) : (
            <Profile
              name="Sinh viên"
              role="STUDENT"
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

        {classInfo && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4">
            <h2 className="text-lg font-semibold">
              Lớp học: {classInfo.classCode} -{' '}
              {classInfo.course?.courseName || 'Không có thông tin khóa học'}
            </h2>
            <p className="text-sm text-gray-600">Loại lớp: {classInfo.type}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              date={notification.date}
              title={notification.title}
            />
          ))
        ) : (
          <div className="mt-8 text-center text-gray-500">
            Không có thông báo nào cho lớp học này.
          </div>
        )}
      </div>
    </div>
  );
};
