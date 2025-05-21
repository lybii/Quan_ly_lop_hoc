import React, { useState } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import { Class } from '../page/Classroom';

interface ClassProps {
  image: string;
  name: string;
}

export const Classroom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classImage, setClassImage] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New class:', { className, classImage });
    setIsModalOpen(false);
    setClassName('');
    setClassImage('');
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Lớp học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox />
        <div className="flex items-center gap-4">
          <Profile
            name="TranBaLoi"
            role="Sinh viên"
            image="../../src/assets/avatar.png"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Thêm lớp học mới</h2>
            <form onSubmit={handleAddClass}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Tên lớp học
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full rounded-lg border p-2"
                  placeholder="Nhập tên lớp học"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Link ảnh lớp học
                </label>
                <input
                  type="text"
                  value={classImage}
                  onChange={(e) => setClassImage(e.target.value)}
                  className="w-full rounded-lg border p-2"
                  placeholder="Nhập URL ảnh"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full mb-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            + Thêm lớp học
          </button>
        </div>

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
