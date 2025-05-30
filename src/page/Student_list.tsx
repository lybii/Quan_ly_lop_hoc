import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '../components/Profile';
import { SearchBox } from '../components/Search_box';
import { Title } from '../components/Title';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

interface Student {
  id: number;
  user: {
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
  };
  classId: number;
}

interface Lecturer {
  id: number;
  user: {
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
  };
  classId: number;
}

interface ClassInfo {
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
  lecturers: Lecturer[];
  students: Student[];
}

export const StudentInfor: React.FC<Student> = ({ user }) => {
  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="mx-5 my-auto flex items-center justify-center">
        <img
          className="h-[70px] w-[70px] rounded-full"
          src={user.avatar || '../../src/assets/avatar.png'}
          alt="profile"
        />
      </div>
      <h1 className="my-auto ml-4 w-auto text-center text-xl font-medium">
        {user.userName}
      </h1>
      <button className="ml-auto mr-5 flex items-end justify-end">
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
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
        <h1 className="text-xl font-medium">Thông tin</h1>
      </button>
    </div>
  );
};

// Teacher information component
export const TeacherInfo: React.FC<{ lecturer: Lecturer }> = ({ lecturer }) => {
  return (
    <div className="mb-6 rounded-lg bg-blue-50 p-4 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-blue-800">Giảng viên</h2>
      <div className="flex items-center">
        <div className="mr-4">
          <img
            className="h-16 w-16 rounded-full border-2 border-blue-300"
            src={lecturer.user.avatar || '../../src/assets/avatar.png'}
            alt="Teacher profile"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium">{lecturer.user.userName}</h3>
          <p className="text-sm text-gray-600">{lecturer.user.email}</p>
          {lecturer.user.phoneNumber && (
            <p className="text-sm text-gray-600">
              SĐT: {lecturer.user.phoneNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StudentList: React.FC = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        // Fetch user info
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          const userData = userResponse.data.data;
          setUser(userData);
          // Check if the user is a student
          setIsStudent(userData.role.name === 'STUDENT');
        }

        // Fetch class info which includes students list
        const classResponse = await api.get(`/api/classes/${classId}`);
        if (classResponse.data.success) {
          const classData = classResponse.data.data;
          setClassInfo(classData);

          // Sort students by name
          const sortedStudents = [...(classData.students || [])].sort((a, b) =>
            a.user.userName.localeCompare(b.user.userName)
          );

          setStudents(sortedStudents);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Không thể tải danh sách sinh viên');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort students by name based on current sort order
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const comparison = a.user.userName.localeCompare(b.user.userName);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title
        title={`Danh sách sinh viên - ${classInfo?.course.courseName || ''}`}
      />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={setSearchTerm} />
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
        <div className="flex flex-col">
          {/* Display teacher information if user is a student */}
          {isStudent &&
            classInfo?.lecturers &&
            classInfo.lecturers.length > 0 && (
              <TeacherInfo lecturer={classInfo.lecturers[0]} />
            )}

          <div className="mb-6 flex items-center justify-between p-4">
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              <span>Sắp xếp theo tên</span>
              {sortOrder === 'asc' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-4">
              <select className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả sinh viên</option>
              </select>
            </div>
          </div>

          {/* Show all lecturers if there are multiple */}
          {isStudent &&
            classInfo?.lecturers &&
            classInfo.lecturers.length > 1 && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">Các giảng viên khác:</h3>
                <div className="flex flex-wrap gap-4">
                  {classInfo.lecturers.slice(1).map((lecturer) => (
                    <div key={lecturer.id} className="flex items-center">
                      <img
                        className="mr-2 h-8 w-8 rounded-full"
                        src={
                          lecturer.user.avatar || '../../src/assets/avatar.png'
                        }
                        alt="Teacher"
                      />
                      <span>{lecturer.user.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Table view for students */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Ảnh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Mã sinh viên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Họ và tên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Số điện thoại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedStudents.length > 0 ? (
                  sortedStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            student.user.avatar || '../../src/assets/avatar.png'
                          }
                          alt="student"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {student.user.code}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.user.userName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {student.user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {student.user.phoneNumber || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Không có sinh viên nào trong lớp học này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
