import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

interface LectureProps {
  id: number;
  title: string;
  description: string;
  file: string;
  startTime: string;
  endTime: string;
  status: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function formatTime(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
}

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  return days[date.getDay()];
}

const LectureItem: React.FC<LectureProps> = ({
  id,
  title,
  description,
  file,
  startTime,
  endTime,
  status,
}) => {
  const date = formatDate(startTime);
  const time = formatTime(startTime, endTime);
  const day = getDayOfWeek(startTime);

  const statusText = status === 1 ? 'Đã diễn ra' : 'Chưa diễn ra';
  const statusClass =
    status === 1 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800';

  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h1 className="my-auto text-xl font-semibold">
          {day}, ngày {date}
        </h1>
        <p className="my-auto text-sm font-normal">
          Tiêu đề:
          <p className="ml-1 inline text-sm font-medium text-red-500">
            {title}
          </p>
        </p>
        <div className="my-auto flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p className="ml-2 inline text-sm">{file}</p>
        </div>
      </div>
      <p className="mx-auto">{description}</p>
      <div className="flex h-full flex-col">
        <div
          className={`my-auto mr-4 flex h-auto w-auto justify-start rounded-lg ${statusClass} p-2`}
        >
          <p className="text-xs font-medium">{statusText}</p>
        </div>
        <div className="my-auto flex items-center">
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

          <p className="ml-2 inline text-sm">{time}</p>
        </div>
      </div>
    </div>
  );
};

export const RollCallList: React.FC = () => {
  const { classId } = useParams();
  const [lectures, setLectures] = useState<LectureProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch lectures
        const response = await api.get(
          `/api/lectures/lectures/class/${classId}`
        );
        setLectures(response.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch lecture data');
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Danh sách buổi học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={() => {}} />
        <div className="flex">
          {user && (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../src/assets/avatar.png'}
            />
          )}
        </div>
      </div>
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        {lectures.length > 0 ? (
          lectures.map((lecture) => (
            <LectureItem
              key={lecture.id}
              id={lecture.id}
              title={lecture.title}
              description={lecture.description}
              file={lecture.file}
              startTime={lecture.startTime}
              endTime={lecture.endTime}
              status={lecture.status}
            />
          ))
        ) : (
          <div className="p-4 text-center">Không có buổi học nào</div>
        )}
      </div>
    </div>
  );
};
