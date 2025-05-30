import React, { useState, useEffect } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import api from '../api/axiosConfig';

interface Lecture {
  id: number;
  title: string;
  description: string;
  file: string;
  startTime: string;
  endTime: string;
  status: number;
  classId: number;
}

interface ScheduleData {
  [weekKey: string]: Lecture[];
}

const Calendar: React.FC = () => {
  const daysOfWeek = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const currentDay = currentDate.getDate();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate
    .toLocaleString('vi-VN', { month: 'long' })
    .toUpperCase();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userResponse = await api.get(`/api/users/${userId}`);
          if (userResponse.data.success) {
            setUser(userResponse.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the current month and year
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Bạn cần đăng nhập để xem lịch học');
          return;
        }

        const response = await api.get(
          `/api/lectures/schedule/month/2?year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setScheduleData(response.data);
      } catch (error: any) {
        console.error('Error fetching schedule data:', error);
        setError('Không thể tải dữ liệu lịch học');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [currentDate]);

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Helper function to format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Find lectures scheduled for a specific day
  const getLecturesForDay = (day: number) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const targetDateString = targetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    let dayLectures: Lecture[] = [];

    // Loop through all weeks in the schedule data
    Object.values(scheduleData).forEach((weekLectures) => {
      // Find lectures that match the target date
      const matchedLectures = weekLectures.filter((lecture) => {
        const lectureDate = new Date(lecture.startTime)
          .toISOString()
          .split('T')[0];
        return lectureDate === targetDateString;
      });

      dayLectures = [...dayLectures, ...matchedLectures];
    });

    return dayLectures;
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-[120px] w-auto border p-2 text-center"
        ></div>
      );
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dayLectures = getLecturesForDay(i);

      days.push(
        <div
          key={i}
          className={`h-[120px] w-auto overflow-auto border p-2 ${i === currentDay && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'bg-blue-100' : ''}`}
        >
          <div
            className={`mb-1 text-center font-bold ${i === currentDay && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'text-blue-600' : ''}`}
          >
            {i}
          </div>
          {dayLectures.map((lecture) => (
            <div
              key={lecture.id}
              className="mb-1 rounded bg-green-500 p-1 text-xs text-white"
            >
              <div className="font-bold">{lecture.title}</div>
              <div>
                {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Lịch" />
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
              name="Sinh viên"
              role="STUDENT"
              image="../../src/assets/avatar.png"
            />
          )}
        </div>
      </div>
      <div className="-mt-8 h-auto w-auto rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">{`Tháng ${currentMonthNumber}, ${currentYear}`}</h1>
          <button
            onClick={goToNextMonth}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="py-4 text-center">Đang tải dữ liệu lịch học...</div>
        )}
        {error && <div className="py-4 text-center text-red-500">{error}</div>}

        <div className="mb-2 grid grid-cols-7">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{renderDays()}</div>

        {/* Legend */}
        <div className="mt-4 border-t pt-2">
          <h3 className="mb-2 font-bold">Chú thích:</h3>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 bg-green-500"></div>
            <span>Buổi học</span>
          </div>
          <div className="mt-1 flex items-center">
            <div className="mr-2 h-4 w-4 bg-blue-100"></div>
            <span>Ngày hiện tại</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Calendar;
