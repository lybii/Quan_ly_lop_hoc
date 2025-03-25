import React, { useEffect, useRef, useState } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';

export const EditProfile: React.FC = () => {
  const [isDisiable, setIsDisiable] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isDisiable && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isDisiable]);
  const handleEditClick = () => {
    setIsDisiable(false);
  };
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông tin cá nhân" />
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

      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-6">
        <div className="col-span-4 flex flex-col">
          <div className="flex justify-between">
            <h1 className="flex text-xl font-bold">Thông tin cá nhân</h1>
            <button
              className="h-[50px] w-[110px] rounded-xl border border-gray-600"
              onClick={handleEditClick}
            >
              Chỉnh sửa
            </button>
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Họ và tên</h1>
            <input
              type="text"
              disabled={isDisiable}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
              id="fullname"
              ref={nameInputRef}
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Mã sinh viên</h1>
            <input
              type="text"
              disabled={isDisiable}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Ngày sinh</h1>
            <input
              type="text"
              disabled={isDisiable}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Email</h1>
            <input
              type="text"
              disabled={isDisiable}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
            />
          </div>
          <div className="">
            <h1 className="mt-5 text-base font-bold">Số điện thoại</h1>
            <input
              type="text"
              disabled={isDisiable}
              className="h-[50px] w-full rounded-xl border border-gray-600 px-3 text-xl"
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex h-auto w-full flex-col items-center justify-center">
            <img
              src="../../src/assets/avatar.png"
              alt="Profile"
              className="h-[200px] w-[200px] rounded-full"
            />
            <button className="mt-5 h-[50px] w-[200px] rounded-xl border border-gray-600">
              Thay đổi
            </button>
          </div>
          <div className="flex h-full w-full items-end justify-around">
            <button className="mt-5 h-[50px] w-[180px] rounded-xl border border-gray-600 bg-red-600 text-white">
              Xóa tài khoản
            </button>
            <button
              className="mt-5 h-[50px] w-[180px] rounded-xl border border-gray-600 bg-blue-600 text-white"
              onClick={() => setIsDisiable(true)}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
