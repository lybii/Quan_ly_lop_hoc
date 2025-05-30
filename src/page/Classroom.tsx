import React, { useState, useEffect, useMemo } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

interface ClassProps {
  image: string;
  name: string;
  classData: any;
}

export const Class: React.FC<ClassProps> = ({ image, name, classData }) => {
  return (
    <div className="m-auto my-4 flex h-[270px] w-[300px] flex-col rounded-2xl bg-white shadow-2xl">
      <img
        className="h-[170px] w-full rounded-2xl"
        src={image}
        alt="classroom"
      />
      <h1 className="my-auto ml-4 w-auto text-center text-xl font-bold">
        {name}
      </h1>
      <Link to={`${classData.id}`}>
        <div className="mb-2 flex w-full">
          <button className="ml-auto mr-auto h-[40px] w-[230px] rounded-2xl border-2 border-black bg-gray-300">
            Open Classroom
          </button>
        </div>
      </Link>
    </div>
  );
};

export const Classroom: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          const role = userResponse.data.data.role.name;
          if (role === 'STUDENT') {
            const processResponse = await api.get(
              `/api/classes/learning-process?studentId=${userId}`
            );
            if (processResponse.data.success) {
              const classes = processResponse.data.data;

              const classDetailsPromises = classes.map((classItem: any) =>
                api.get(`/api/classes/${classItem.classId}`)
              );
              const classDetailsResponses =
                await Promise.all(classDetailsPromises);

              const detailedClasses = classes.map(
                (classItem: any, index: number) => ({
                  ...classItem,
                  ...classDetailsResponses[index].data.data,
                })
              );

              setClasses(detailedClasses);

              const uniqueCourses = detailedClasses.reduce(
                (acc: any[], item: any) => {
                  if (
                    item.course &&
                    !acc.some((c) => c.id === item.course.id)
                  ) {
                    acc.push({
                      id: item.course.id,
                      courseName: item.course.courseName,
                      courseCode: item.course.courseCode,
                    });
                  }
                  return acc;
                },
                []
              );
              setCourses(uniqueCourses);
            }
          } else if (role === 'LECTURER') {
            const coursesResponse = await api.get(
              `/api/courses/teacher/${userId}`
            );
            if (coursesResponse.data.success) {
              setCourses(coursesResponse.data.data);
              const coursePromises = coursesResponse.data.data.map(
                (course: any) =>
                  api.get(`/api/courses/${course.id}/classes/teacher/${userId}`)
              );
              const classResponses = await Promise.all(coursePromises);
              const allClasses = classResponses.flatMap((response) =>
                response.data.success ? response.data.data : []
              );
              const classDetailsPromises = allClasses.map((classItem: any) =>
                api.get(`/api/classes/${classItem.id}`)
              );
              const classDetailsResponses =
                await Promise.all(classDetailsPromises);

              const detailedClasses = classDetailsResponses
                .map((response) =>
                  response.data.success ? response.data.data : null
                )
                .filter(Boolean);

              setClasses(detailedClasses);
            }
          }
        }
      } catch (error: any) {
        setError(error.message || 'Không thể tải thông tin lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredClasses = useMemo(() => {
    if (selectedCourse === 'all') return classes;
    return classes.filter((classItem) => {
      // Check if course property exists and its ID matches the selected course
      return (
        classItem.course && classItem.course.id === parseInt(selectedCourse)
      );
    });
  }, [classes, selectedCourse]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Lớp học" />
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

      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4">
        <div className="flex flex-col">
          <div className="mb-6 flex items-end justify-end p-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả khóa học</option>
                {courses
                  .filter((course) => course && course.id)
                  .map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.courseCode} -{' '}
                      {course.courseName || 'Unnamed Course'}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {' '}
            {filteredClasses.map((classItem, index) => (
              <div key={classItem.id || index}>
                <div className="m-auto my-4 flex h-[270px] w-[300px] flex-col rounded-2xl bg-white shadow-2xl">
                  <img
                    className="h-[170px] w-full rounded-2xl"
                    src="../../src/assets/class.png"
                    alt="classroom"
                  />
                  <h1 className="my-auto ml-4 w-auto text-center text-xl font-bold">
                    {classItem.classCode || classItem.className}
                  </h1>{' '}
                  <Link to={`${classItem.id}`}>
                    <div className="mb-2 flex w-full">
                      <button className="ml-auto mr-auto h-[40px] w-[230px] rounded-2xl border-2 border-black bg-gray-300">
                        Open Classroom
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
