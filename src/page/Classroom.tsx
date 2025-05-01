import React from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import { Link } from 'react-router-dom';

interface ClassProps {
  image: string;
  name: string;
}

export const Class: React.FC<ClassProps> = ({ image, name }) => {
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
      <Link to="/classroom/infor">
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
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Lớp học" />
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
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
        <Class image="../../src/assets/avatar.png" name="OOP - 1" />
      </div>
    </div>
  );
};
