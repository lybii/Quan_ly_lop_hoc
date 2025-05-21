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
  lecturers: Array<{
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
  }>;
  students: Student[];
}

export const StudentInfor: React.FC<Student> = ({
  user,
}) => {
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

export const StudentList: React.FC = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        // Fetch user info
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch class info which includes students list
        const classResponse = await api.get(`/api/classes/${classId}`);
        if (classResponse.data.success) {
          const classData = classResponse.data.data;
          setClassInfo(classData);
          setStudents(classData.students || []);
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

  const filteredStudents = students.filter(student =>
    student.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title={`Danh sách sinh viên - ${classInfo?.course.courseName || ''}`} />
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
          <div className="mb-6 flex items-end justify-end p-4">
            <div className="flex items-center gap-4">
              <select
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả sinh viên</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id}>
                  <div className="m-auto my-4 flex h-[270px] w-[300px] flex-col rounded-2xl bg-white shadow-2xl">
                    <img
                      className="h-[170px] w-full rounded-2xl"
                      src={student.user.avatar || '../../src/assets/avatar.png'}
                      alt="student"
                    />
                    <h1 className="my-auto ml-4 w-auto text-center text-xl font-bold">
                      {student.user.userName}
                    </h1>
                    {/* <div className="mb-2 flex w-full">
                      <Link to={`/student/classroom/${classId}/studentlist`}>
                        <button className="ml-auto mr-auto h-[40px] w-[230px] rounded-2xl border-2 border-black bg-gray-300">
                          Xem chi tiết
                        </button>
                      </Link>
                    </div> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                Không có sinh viên nào trong lớp học này
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
