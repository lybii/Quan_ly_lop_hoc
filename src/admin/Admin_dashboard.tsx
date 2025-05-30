import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Profile } from '../components/Profile';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { DateList } from '../components/dashboard/Day';
import { ProfileRank } from '../components/dashboard/Profile_rank';
import { SubjectInDay } from '../components/dashboard/Subject_in_day';

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

interface UserStats {
  total: number;
  active: number;
  new: number;
  inactive: number;
  roles: {
    students: number;
    teachers: number;
    admins: number;
  };
}

interface ClassStats {
  total: number;
  active: number;
  completed: number;
  subjects: {
    [key: string]: number;
  };
}

const AdminDashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const [selectedStats, setSelectedStats] = useState<'users' | 'classes'>(
    'users'
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    new: 0,
    inactive: 0,
    roles: {
      students: 0,
      teachers: 0,
      admins: 0,
    },
  });
  const [classStats, setClassStats] = useState<ClassStats>({
    total: 0,
    active: 0,
    completed: 0,
    subjects: {},
  });

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Bạn cần đăng nhập để xem thông tin.');
          setLoading(false);
          return;
        }

        // Get user ID from local storage or JWT decode
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError('Không tìm thấy thông tin người dùng.');
          setLoading(false);
          return;
        }

        // Use the correct API endpoint to get user info by ID
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCurrentUser(response.data.data);
        } else {
          setError('Không thể tải thông tin người dùng.');
        }
      } catch (error: any) {
        console.error('Error fetching current user:', error);
        if (error.response && error.response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
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

        // Fetch lecturers
        const lecturersResponse = await axios.get(
          'http://localhost:8080/api/users/lecturers',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch admins
        const adminsResponse = await axios.get(
          'http://localhost:8080/api/users/admins',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch courses (for class statistics)
        const coursesResponse = await axios.get(
          'http://localhost:8080/api/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          studentsResponse.data.success &&
          lecturersResponse.data.success &&
          adminsResponse.data.success
        ) {
          const students = studentsResponse.data.data || [];
          const lecturers = lecturersResponse.data.data || [];
          const admins = adminsResponse.data.data || [];
          const courses = coursesResponse.data.success
            ? coursesResponse.data.data || []
            : [];

          // Calculate user statistics
          const activeStudents = students.filter(
            (s: User) => s.status === 1
          ).length;
          const activeLecturers = lecturers.filter(
            (l: User) => l.status === 1
          ).length;
          const activeAdmins = admins.filter(
            (a: User) => a.status === 1
          ).length;

          const totalUsers = students.length + lecturers.length + admins.length;
          const activeUsers = activeStudents + activeLecturers + activeAdmins;

          // Calculate new users (registered in the last 30 days)
          // This is a placeholder since we don't have registration date in the API
          const newUsers = 0;

          setUserStats({
            total: totalUsers,
            active: activeUsers,
            new: newUsers,
            inactive: totalUsers - activeUsers,
            roles: {
              students: students.length,
              teachers: lecturers.length,
              admins: admins.length,
            },
          });

          // Calculate class statistics
          // This is a placeholder since we don't have direct class data
          let totalClasses = 0;
          let activeClasses = 0;
          let completedClasses = 0;
          let subjectCounts: { [key: string]: number } = {};

          // If we have course data, we can use it to calculate class statistics
          if (courses.length > 0) {
            courses.forEach((course: any) => {
              // Assuming each course has a classes array or property
              const courseClasses = course.classes || [];
              totalClasses += courseClasses.length;

              // Count active and completed classes
              const activeCourseClasses = courseClasses.filter(
                (c: any) => c.status === 1
              ).length;
              activeClasses += activeCourseClasses;
              completedClasses += courseClasses.length - activeCourseClasses;

              // Count classes by subject
              if (!subjectCounts[course.courseName]) {
                subjectCounts[course.courseName] = 0;
              }
              subjectCounts[course.courseName] += courseClasses.length;
            });
          } else {
            // If no course data, use placeholder values
            totalClasses = 30;
            activeClasses = 25;
            completedClasses = 5;
            subjectCounts = {
              'Lập trình': 10,
              'Toán học': 8,
              'Khoa học': 5,
              'Ngoại ngữ': 7,
            };
          }

          setClassStats({
            total: totalClasses,
            active: activeClasses,
            completed: completedClasses,
            subjects: subjectCounts,
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
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

  // Get the latest users for the profile rank component
  const getLatestUsers = () => {
    // This is a placeholder since we don't have registration date in the API
    return [
      { name: 'Nguyễn Văn A', score: 0 },
      { name: 'Trần Thị B', score: 0 },
    ];
  };

  const latestUsers = getLatestUsers();

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Main Content */}
      <div className="no-scrollbar flex-1 overflow-auto scroll-smooth p-4">
        <Title title="Trang chủ" />
        <SearchBox />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Announcement */}
          <div className="col-span-2 h-[157px] rounded-xl bg-white p-4">
            <h2 className="mb-2 text-lg font-bold md:text-xl">
              Thông báo hệ thống
            </h2>
            <div className="flex h-[74px] items-center rounded-lg bg-sky-200">
              <p className="ml-4">
                {currentUser
                  ? `Chào mừng ${currentUser.userName}! Bạn đang đăng nhập với vai trò ${getRoleDisplayName(currentUser.role.name)}.`
                  : 'Chào mừng quản trị viên!'}
              </p>
            </div>
          </div>

          {/* User Statistics */}
          <div className="no-scrollbar col-span-1 h-[400px] overflow-auto rounded-3xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Thống kê người dùng</h2>
              <div className="flex gap-2">
                <button className="rounded-lg bg-blue-100 px-3 py-1 text-blue-600 hover:bg-blue-200">
                  Xuất báo cáo
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex justify-between">
                <h3 className="font-bold">
                  Tổng số người dùng: {userStats.total}
                </h3>
                <span className="text-green-500">+{userStats.new} mới</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Người dùng theo vai trò:</h3>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-blue-100 p-2 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.roles.students}
                  </div>
                  <div className="text-sm">Sinh viên</div>
                </div>
                <div className="rounded-lg bg-green-100 p-2 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.roles.teachers}
                  </div>
                  <div className="text-sm">Giảng viên</div>
                </div>
                <div className="rounded-lg bg-purple-100 p-2 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userStats.roles.admins}
                  </div>
                  <div className="text-sm">Admin</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Trạng thái người dùng:</h3>
              <div className="mt-2 flex items-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {userStats.total > 0
                        ? Math.round((userStats.active / userStats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
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
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${userStats.total > 0 ? (userStats.active / userStats.total) * 100 : 0}, 100`}
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="mb-1 flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                    <span>Hoạt động: {userStats.active}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-gray-300"></div>
                    <span>Không hoạt động: {userStats.inactive}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold">Người dùng mới nhất</h3>
              <div className="flex flex-col gap-2">
                {latestUsers.map((user, index) => (
                  <ProfileRank
                    key={index}
                    name={user.name}
                    score={user.score}
                    backgroundColor={
                      index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Class Statistics */}
          <div className="no-scrollbar col-span-1 h-[400px] rounded-3xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Thống kê lớp học</h2>
              <div className="flex gap-2">
                <button className="rounded-lg bg-blue-100 px-3 py-1 text-blue-600 hover:bg-blue-200">
                  Xuất báo cáo
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Tổng số lớp học: {classStats.total}</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">
                  Lớp học đang hoạt động: {classStats.active}
                </h3>
                <span className="text-blue-500">
                  {classStats.total > 0
                    ? Math.round((classStats.active / classStats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${classStats.total > 0 ? (classStats.active / classStats.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">
                  Lớp học đã hoàn thành: {classStats.completed}
                </h3>
                <span className="text-green-500">
                  {classStats.total > 0
                    ? Math.round(
                        (classStats.completed / classStats.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${classStats.total > 0 ? (classStats.completed / classStats.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Admin Tasks */}
          <div className="col-span-2 rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-xl font-bold">
              Nhiệm vụ quản lý tài khoản
            </h2>
            <div className="mb-2">
              <h3 className="font-bold">Duyệt tài khoản mới</h3>
              <p>5 tài khoản đang chờ duyệt</p>
              <p>
                11.00 AM - <span className="text-orange-500">Chờ xử lý</span>
              </p>
            </div>
            <div className="mb-2">
              <h3 className="font-bold">Yêu cầu đặt lại mật khẩu</h3>
              <p>3 yêu cầu từ người dùng</p>
              <p>
                11.40 AM - <span className="text-orange-500">Chờ xử lý</span>
              </p>
            </div>
            <div>
              <h3 className="font-bold">Khóa tài khoản</h3>
              <p>1 tài khoản vi phạm quy định</p>
              <p>
                10.00 AM - <span className="text-green-500">Đã xử lý</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="-mr-4 -mt-4 hidden rounded-l-2xl bg-white p-4 md:block md:w-1/4">
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex h-20 items-center justify-center">
            <p className="text-red-500">Lỗi: {error}</p>
          </div>
        ) : currentUser ? (
          <Profile
            name={currentUser.userName}
            image={currentUser.avatar || '../../src/assets/admin_avatar.png'}
            role={getRoleDisplayName(currentUser.role.name)}
          />
        ) : (
          <Profile
            name="Người dùng"
            image="../../src/assets/admin_avatar.png"
            role="Chưa xác định"
          />
        )}

        <div className="rounded p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Tháng {month}</h2>
            <div className="flex gap-2">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-7 flex flex-wrap justify-between">
            <DateList />
          </div>
          <div className="flex items-center justify-center">
            <h1 className="mb-2 text-xl font-bold">Thống kê hệ thống</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-auto h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <SubjectInDay
            id={1}
            subject={`Tổng người dùng: ${userStats.total}`}
            time={`Cập nhật: ${new Date().toLocaleTimeString()}`}
          />
          <SubjectInDay
            id={2}
            subject={`Tổng lớp học: ${classStats.total}`}
            time={`Cập nhật: ${new Date().toLocaleTimeString()}`}
          />
          <SubjectInDay
            id={3}
            subject={`Người dùng hoạt động: ${userStats.active}`}
            time={`Cập nhật: ${new Date().toLocaleTimeString()}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
