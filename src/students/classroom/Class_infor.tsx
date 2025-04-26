import React from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { Link } from 'react-router-dom';

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
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông tin lớp học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox />
        <div className="flex">
          <Profile
            name="TranBaLoi"
            role="Sinh viên"
            image="../../src/assets/avatar.png"
          />
        </div>
      </div>
      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/classroom/infor/studentlist">
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
            name="Danh sách sinh viên"
          />
        </Link>
        <Link to={'/classroom/infor/rollcall'}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/10270/10270677.png"
            name="Điểm danh"
          />
        </Link>

        <Link to={'/classroom/infor/assignment'}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/2113/2113781.png"
            name="Bài tập"
          />
        </Link>

        <Link to={'/classroom/infor/notification'}>
          <ClassSetting
            image="https://cdn-icons-png.flaticon.com/512/2529/2529521.png"
            name="Thông báo"
          />
        </Link>
        <Link to={'/classroom/infor/score'}>
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
