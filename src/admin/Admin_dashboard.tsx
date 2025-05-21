import React from 'react';

import { Profile } from '../components/Profile';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { DateList } from '../components/dashboard/Day';
import { ProfileRank } from '../components/dashboard/Profile_rank';
import { SubjectInDay } from '../components/dashboard/Subject_in_day';

const AdminDashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Main Content */}
      <div className="no-scrollbar flex-1 overflow-auto scroll-smooth p-4">
        <Title title="Trang chủ" />
        <SearchBox />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Announcement */}
          <div className="col-span-2 h-[157px] rounded-xl bg-white p-4">
            <h2 className="mb-2 text-lg font-bold md:text-xl">
              Thông báo hệ thống
            </h2>
            <div className="flex h-[74px] items-center rounded-lg bg-sky-200">
              <p className="ml-4">Chào mừng quản trị viên! </p>
            </div>
          </div>

          {/* User Account List */}
          <div className="no-scrollbar col-span-1 h-[300px] overflow-auto rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Danh sách tài khoản</h2>
            <div className="flex flex-col gap-2">
              <ProfileRank
                name="Nguyễn Văn A"
                image="user1.jpg"
                score={0}
                backgroundColor="bg-pink-100"
              />
              <ProfileRank
                name="Trần Thị B"
                image="user2.jpg"
                score={0}
                backgroundColor="bg-blue-100"
              />
              <ProfileRank
                name="Lê Văn C"
                image="user3.jpg"
                score={0}
                backgroundColor="bg-pink-100"
              />
              <ProfileRank
                name="Phạm Thị D"
                image="user4.jpgQuan"
                score={0}
                backgroundColor="bg-red-100"
              />
              <ProfileRank
                name="Hoàng Văn E"
                image="user5.jpg"
                score={0}
                backgroundColor="bg-pink-100"
              />
            </div>
          </div>

          <div className="no-scrollbar col-span-1 h-[300px] rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Thống kê khóa học</h2>
            <div className="mb-2">
              <h3 className="font-bold">Tổng số khóa học: 15</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-bold">Khóa học đang hoạt động: 10</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '66%' }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold">Khóa học đã hoàn thành: 5</h3>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '33%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Admin Tasks */}
          <div className="col-span-2 rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-xl font-bold">
              Nhiệm vụ quản lý tài khoản
            </h2>
            <div className="mb-2">
              <h3 className="font-bold">Duyệt tài khoản mới</h3>
              <p>5 tài khoản đang chờ duyệt</p>
              <p>
                11.00 AM - <span className="text-orange-500">Chờ xử lý</span>
              </p>
            </div>
            <div className="mb-2">
              <h3 className="font-bold">Yêu cầu đặt lại mật khẩu</h3>
              <p>3 yêu cầu từ người dùng</p>
              <p>
                11.40 AM - <span className="text-orange-500">Chờ xử lý</span>
              </p>
            </div>
            <div>
              <h3 className="font-bold">Khóa tài khoản</h3>
              <p>1 tài khoản vi phạm quy định</p>
              <p>
                10.00 AM - <span className="text-green-500">Đã xử lý</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden rounded-l-2xl bg-white p-4 md:block md:w-1/4">
        <Profile
          name="Trần Bá Lợi"
          image="../../src/assets/admin_avatar.png"
          role="Admin"
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
            <h1 className="mb-2 text-xl font-bold">Thống kê hệ thống</h1>
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
            subject="Tổng người dùng: 200"
            time="Cập nhật: 10.00 AM"
          />
          <SubjectInDay
            id={2}
            subject="Tổng lớp học: 30"
            time="Cập nhật: 11.00 AM"
          />
          <SubjectInDay
            id={3}
            subject="Tổng khóa học: 15"
            time="Cập nhật: 11.00 AM"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
