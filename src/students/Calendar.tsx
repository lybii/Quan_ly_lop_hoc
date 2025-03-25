import React from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';

const Calendar: React.FC = () => {
  const daysOfWeek = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate
    .toLocaleString('vi-VN', { month: 'long' })
    .toUpperCase();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-[100px] w-auto border p-2 text-center"
        ></div>
      );
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={`h-[100px] w-auto border p-2 text-center ${i === currentDay ? 'bg-blue-500 text-white' : ''}`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Lịch" />
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
      <div className="-mt-8 h-auto w-auto rounded-2xl bg-white p-4">
        <h1 className="mb-4 text-2xl font-bold">{`${currentDay}, ${currentMonth}`}</h1>
        <div className="mb-4 flex justify-center">
          <button className="mx-2">Ngày</button>
          <button className="mx-2">Tuần</button>
          <button className="mx-2 rounded-full bg-gray-300 px-4 py-2">
            Tháng
          </button>
          <button className="mx-2">Năm</button>
        </div>
        <div className="grid grid-cols-7">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{renderDays()}</div>
      </div>
    </div>
  );
};
export default Calendar;
