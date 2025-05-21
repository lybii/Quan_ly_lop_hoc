import React, { useEffect, useState } from 'react';
import { Link, useParams, Outlet, useLocation } from 'react-router-dom';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import api from '../api/axiosConfig';

interface ClassSettingProps {
  image: string;
  name: string;
}

export const ClassSetting: React.FC<ClassSettingProps> = ({ image, name }) => {
  return (
    <div className="m-auto my-4 flex h-[270px] w-[300px] flex-col rounded-2xl border border-gray-300 bg-white shadow-2xl">
      <div className="mt-auto flex items-center justify-center">
        <img
          className="h-[120px] w-[120px] rounded-2xl"
          src={image}
          alt="classroom"
        />
      </div>
      <h1 className="my-auto ml-4 w-auto text-center text-xl font-medium">
        {name}
      </h1>
    </div>
  );
};

export const ClassInfor: React.FC = () => {
  const { classId } = useParams();
  const location = useLocation();
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchClassInfo = async () => {
      if (!classId) {
        setError('Không tìm thấy thông tin lớp học');
        setLoading(false);
        return;
      }

      try {
        const userId = localStorage.getItem('userId');
        // Fetch user info and class info in parallel
        const [userResponse, classResponse] = await Promise.all([
          api.get(`/api/users/${userId}`),
          api.get(`/api/classes/${classId}`),
        ]);

        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        if (classResponse.data.success) {
          setClassInfo(classResponse.data.data);
        } else {
          setError('Không thể tải thông tin lớp học');
        }
      } catch (error: any) {
        setError(error.message || 'Không thể tải thông tin lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchClassInfo();
  }, [classId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  // If we're on a sub-route (studentlist, rollcall, etc.), render the Outlet
  if (location.pathname.split('/').length > 4) {
    return <Outlet />;
  }

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title={classInfo?.className || 'Lớp học'} />
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
      </div>{' '}
      <div className="-mt-8 grid h-auto w-auto grid-cols-3 gap-4 rounded-2xl bg-white p-4">
        <Link to={`studentlist`}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/2682/2682065.png"
            name="Danh sách sinh viên"
          />
        </Link>

        <Link to={`rollcall`}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/10270/10270677.png"
            name="Điểm danh"
          />
        </Link>

        <Link to={`assignment`}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/2113/2113781.png"
            name="Bài tập"
          />
        </Link>

        <Link to={`notification`}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/2529/2529521.png"
            name="Thông báo"
          />
        </Link>

        <Link to={`score`}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/9282/9282654.png"
            name="Quản lí điểm"
          />
        </Link>

        <ClassSetting
          image="https://cdn-icons-png.flaticon.com/512/2040/2040504.png"
          name="Cài đặt lớp học"
        />
      </div>
    </div>
  );
};
