import React from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import { Book } from '../components/library/Book';

const Library: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thư viện" />
      <div className="-mt-8 flex items-center justify-between">
        <SearchBox />
        <div className="flex items-center">
          <Profile
            name="TranBaLoi"
            role="Admin"
            image="../../src/assets/avatar.png"
          />
        </div>
      </div>
      <div className="-mt-8 grid h-auto w-auto rounded-2xl bg-white p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-full mb-4 flex justify-end">
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            onClick={() => alert('Thêm sách mới')}
          >
            Thêm sách
          </button>
        </div>
        <Book image="../../src/assets/avatar.png" name="OOP" />
        <Book image="../../src/assets/avatar.png" name="OOP" />
        <Book image="../../src/assets/avatar.png" name="OOP" />
        <Book image="../../src/assets/avatar.png" name="OOP" />
        <Book image="../../src/assets/avatar.png" name="OOP" />
        <Book image="../../src/assets/avatar.png" name="OOP" />
      </div>
    </div>
  );
};

export default Library;
