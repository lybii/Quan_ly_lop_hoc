import React from 'react';

import { Profile } from '../components/Profile';
import { ProfileRank } from '../components/dashboard/Profile_rank';
import { SubjectInDay } from '../components/dashboard/Subject_in_day';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { DateList } from '../components/dashboard/Day';

const Dashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are zero-based in JavaScript
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Main Content */}
      <div className="no-scrollbar flex-1 overflow-auto scroll-smooth p-4">
        <Title title="Trang chủ" />
        <SearchBox />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Announcement */}
          <div className="col-span-2 h-[157px] rounded-xl bg-white p-4">
            <h2 className="mb-2 text-lg font-bold md:text-xl">Thông báo</h2>
            <div className="flex h-[74px] items-center rounded-lg bg-sky-200">
              <p className="ml-4">
                Xin chào! <strong>Trần Bá Lợi</strong> bạn có lịch dạy môn Lập
                trình hướng đối tượng vào lúc <strong>10.00 giờ</strong>
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="no-scrollbar col-span-1 h-[300px] overflow-auto rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Bảng điểm</h2>
            <div className="flex flex-col gap-2">
              <ProfileRank
                name="Trần Bá Lợi"
                image="profile1.jpg"
                score={90}
                backgroundColor="bg-pink-100"
              />
              <ProfileRank
                name="Trần Bá Lợi"
                image="profile1.jpg"
                score={90}
                backgroundColor="bg-blue-100"
              />
              <ProfileRank
                name="Trần Bá Lợi"
                image="profile1.jpg"
                score={90}
                backgroundColor="bg-pink-100"
              />
              <ProfileRank
                name="Trần Bá Lợi"
                image="profile1.jpg"
                score={90}
                backgroundColor="bg-red-100"
              />
              <ProfileRank
                name="Trần Bá Lợi"
                image="profile1.jpg"
                score={90}
                backgroundColor="bg-pink-100"
              />
            </div>
          </div>

          {/* Completion Progress */}
          <div className="no-scrollbar col-span-1 h-[300px] rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Tiến trình học tập</h2>
            <div className="mb-2">
              <h3 className="font-bold">OOP</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-bold">Python</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold">CNPM</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '30%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="col-span-2 rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-xl font-bold">Nhiệm vụ</h2>
            <div className="mb-2">
              <h3 className="font-bold">OOP</h3>
              <p>Chapter 5</p>
              <p>
                11.00 AM - <span className="text-orange-500">Pending</span>
              </p>
            </div>
            <div className="mb-2">
              <h3 className="font-bold">Python</h3>
              <p>Chapter 4</p>
              <p>
                11.40 AM - <span className="text-orange-500">Pending</span>
              </p>
            </div>
            <div>
              <h3 className="font-bold">Python</h3>
              <p>Chapter 2</p>
              <p>
                10.00 AM - <span className="text-green-500">Completed</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden rounded-l-2xl bg-white p-4 md:block md:w-1/4">
        <Profile
          name="Trần Bá Lợi"
          image="../../src/assets/avatar.png"
          role="Teacher"
        />

        <div className="rounded p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Tháng {month}</h2>
            <div className="flex gap-2">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-7 flex flex-wrap justify-between">
            <DateList />
          </div>
          <div className="flex items-center justify-center">
            <h1 className="mb-2 text-xl font-bold">Thời khóa biểu</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-auto h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <SubjectInDay
            id={1}
            subject="Lập trình hướng đối tượng"
            time="10.00 AM"
          />
          <SubjectInDay id={2} subject="Lập trình với Python" time="11.00 AM" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
