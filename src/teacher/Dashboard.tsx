import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Profile } from '../components/Profile';
import { SubjectInDay } from '../components/dashboard/Subject_in_day';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { DateList } from '../components/dashboard/Day';
import { userService } from '../services/userService';

interface Course {
  id: number;
  courseName: string;
  code: string;
  description: string;
  status: number;
  credits: number;
}

interface Class {
  id: number;
  classCode: string;
  type: string;
  count: number;
  status: number;
  courseId: number;
  classUserId?: number;
  studentIds?: number[];
}

interface CourseWithClasses extends Course {
  classes: Class[];
  studentCount: number;
}

const Dashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are zero-based in JavaScript
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<CourseWithClasses[]>([]);
  const [activeClasses, setActiveClasses] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
          // After getting user, fetch their courses
          fetchTeacherCourses(response.data.id);
        } else {
          setError(response.message || 'Failed to load user data');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchTeacherCourses = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // Fetch courses taught by the teacher
      const response = await axios.get(
        `http://localhost:8080/api/courses/teacher/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const coursesData = response.data.data || [];
        const enhancedCourses: CourseWithClasses[] = [];

        // Calculate statistics
        let activeClassCount = 0;
        let studentCount = 0;

        // Fetch classes for each course
        for (const course of coursesData) {
          try {
            const classesResponse = await axios.get(
              `http://localhost:8080/api/courses/${course.id}/classes/teacher/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (classesResponse.data.success) {
              const classes = classesResponse.data.data || [];
              let courseStudentCount = 0;

              // Count active classes and students
              classes.forEach((cls: Class) => {
                if (cls.status === 1) {
                  activeClassCount++;
                }
                courseStudentCount += cls.count || 0;
              });

              studentCount += courseStudentCount;

              // Add course with its classes to the list
              enhancedCourses.push({
                ...course,
                classes: classes,
                studentCount: courseStudentCount,
              });
            }
          } catch (error) {
            console.error(
              `Error fetching classes for course ${course.id}:`,
              error
            );
          }
        }

        setCourses(enhancedCourses);
        setActiveClasses(activeClassCount);
        setTotalStudents(studentCount);
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Đang hoạt động' : 'Không hoạt động';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">
          <div className="text-lg font-bold">Lỗi</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Main Content */}
      <div className="no-scrollbar flex-1 overflow-auto scroll-smooth p-4">
        <Title title="Trang chủ giảng viên" />
        <SearchBox onSearch={() => {}} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Announcement */}
          <div className="col-span-2 h-[157px] rounded-xl bg-white p-4">
            <h2 className="mb-2 text-lg font-bold md:text-xl">Thông báo</h2>
            <div className="flex h-[74px] items-center rounded-lg bg-sky-200">
              {user && (
                <p className="ml-4">
                  Xin chào giảng viên <strong>{user.userName}</strong>! Bạn đang
                  giảng dạy <strong>{courses.length}</strong> khóa học với{' '}
                  <strong>{activeClasses}</strong> lớp học đang hoạt động.
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Thống kê giảng dạy</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Courses */}
              <div className="rounded-xl bg-blue-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng khóa học</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {courses.length}
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
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Classes */}
              <div className="rounded-xl bg-green-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lớp học đang dạy</p>
                    <p className="text-2xl font-bold text-green-700">
                      {activeClasses}
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
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Students */}
              <div className="rounded-xl bg-purple-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng sinh viên</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {totalStudents}
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
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Credits */}
              <div className="rounded-xl bg-amber-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng tín chỉ</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {courses.reduce(
                        (sum, course) => sum + (course.credits || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="rounded-full bg-amber-100 p-3 text-amber-700">
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
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="no-scrollbar col-span-2 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Danh sách khóa học</h2>

            {courses.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-600">
                Bạn chưa được phân công giảng dạy khóa học nào.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Mã khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tên khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Số lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Số sinh viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {courses.map((course) => {
                      const classCount = course.classes?.length || 0;

                      return (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {course.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {course.courseName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {classCount}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {course.studentCount}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${course.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {course.status === 1
                                ? 'Đang hoạt động'
                                : 'Không hoạt động'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          <div className="col-span-2 rounded-2xl bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">Lịch dạy sắp tới</h2>
            {courses.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-600">
                Không có lịch dạy nào sắp tới.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold">{course.courseName}</h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${course.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {course.status === 1
                          ? 'Đang hoạt động'
                          : 'Không hoạt động'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mã khóa học: {course.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số tín chỉ: {course.credits}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lớp: {course.classes?.length || 0}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Lịch học:</span> Thứ 2,
                        Thứ 4 (7:00 - 9:00)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="-mr-4 -mt-4 hidden rounded-l-2xl bg-white p-4 md:block md:w-1/4">
        {user && (
          <Profile
            name={user.userName}
            image={user.avatar || '../../src/assets/avatar.png'}
            role="Giảng viên"
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
            <h1 className="mb-2 text-xl font-bold">Lịch giảng dạy hôm nay</h1>
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
          {courses.length > 0 ? (
            courses
              .slice(0, 3)
              .map((course, index) => (
                <SubjectInDay
                  key={course.id}
                  id={index + 1}
                  subject={course.courseName}
                  time={`${7 + index * 2}:00 - ${9 + index * 2}:00`}
                />
              ))
          ) : (
            <div className="mt-2 rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600">
              Không có lịch dạy hôm nay
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
