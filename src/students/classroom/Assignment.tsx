import { Link } from 'react-router-dom';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

interface AssignmentProps {
  title: string;
  description: string;
  subject: string;
  status: string;
  deadline: string;
}

const Assignment: React.FC<AssignmentProps> = ({
  title,
  description,
  subject,
  status,
  deadline,
}) => {
  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h3 className="my-auto text-xl font-semibold">{title}</h3>

        <p className="my-auto inline text-sm font-medium text-red-500">
          {subject}
        </p>
      </div>
      <p className="mx-auto">{description}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-4 flex h-auto w-auto justify-center rounded-lg bg-red-400 p-2">
          <p className="text-xs font-medium text-red-800">{status}</p>
        </div>
        <div className="my-auto flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <p className="mr-2 inline text-sm">{deadline}</p>
        </div>
      </div>
    </div>
  );
};

export const AssignmentList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Bài tập" />
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
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        <Link to="/classroom/infor/assignment/1">
          <Assignment
            title="Bài tập 1"
            description="Làm bài tập 1"
            subject="Công nghệ phần mềm"
            status="Đã nộp"
            deadline="Hạn nộp: 12/12/2023"
          />
        </Link>
      </div>
    </div>
  );
};

export const AssignmentInfor: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Bài tập" />
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
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Bài tập 1</h2>
          <p className="text-gray-600">Môn học: Công nghệ phần mềm</p>
          <p className="text-gray-600">Hạn nộp: 12/12/2023</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Mô tả bài tập:</h3>
          <p className="mt-2">
            1. Sinh viên đọc bài post hướng dẫn môi trường thực hành và cài đặt
            môi trường. 2. Sinh viên tự tìm hiểu về HĐH Ubuntu và các câu lệnh
            command line trên Ubuntu, thử nghiệm luôn trên môi trường máy ảo đã
            cài. (có thể luyện tập ở trang OverTheWire: Level Goal: Bandit Level
            0) 3. Sinh viên thực hành bài telnetlab theo hướng dẫn trên
            dsec.ptit.edu.vn và nộp bài trên hệ thống. 4. Sinh viên thực hiện
            download trước các bài thực hành sau đây bằng cách gõ lệnh:
            labtainer TÊN_BÀI THỰC HÀNH
          </p>
        </div>

        {/* Nộp tập tin */}
        <div className="flex w-full justify-center p-5">
          <div className="w-full max-w-2xl rounded border border-gray-300 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nộp tập tin</h3>
              <div className="flex gap-2">
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </button>
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    ></path>
                  </svg>
                </button>
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="mb-4 flex h-40 items-center justify-center border-2 border-dashed border-gray-300">
              <button>
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <input type="file" className="hidden" multiple />
              </button>
            </div>
            <div className="mb-4 flex justify-between text-sm text-gray-600">
              <p>
                Kích cỡ dữ liệu với các tập tin mới: 300MB, định kèm tối đa: 20
              </p>
              <div className="flex gap-2">
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    ></path>
                  </svg>
                </button>
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0l-4-4m4 4l-4 4"
                    ></path>
                  </svg>
                </button>
                <button className="rounded p-1 hover:bg-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-6m3 3H9m3 0h3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <label className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                <span>Lưu những thay đổi</span>
                <input type="file" className="hidden" multiple />
              </label>
              <button className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-700">
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
};
