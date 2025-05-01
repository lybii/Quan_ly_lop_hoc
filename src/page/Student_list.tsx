import { Profile } from '../components/Profile';
import { SearchBox } from '../components/Search_box';
import { Title } from '../components/Title';

interface StudentInforProps {
  name: string;
  id: string;
  image: string;
}

export const StudentInfor: React.FC<StudentInforProps> = ({
  image,
  id,
  name,
}) => {
  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="mx-5 my-auto flex items-center justify-center">
        <img
          className="h-[70px] w-[70px] rounded-full"
          src={image}
          alt="profile"
        />
      </div>
      <h1 className="my-auto ml-4 w-auto text-center text-xl font-medium">
        {id} - {name}
      </h1>
      <button className="ml-auto mr-5 flex items-end justify-end">
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
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
        <h1 className="text-xl font-medium">Thông tin</h1>
      </button>
    </div>
  );
};

export const StudentList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Danh sách sinh viên" />
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
        <StudentInfor
          image="../../../src/assets/avatar.png"
          name="Nguyễn Văn A"
          id="123456789"
        />
        <StudentInfor
          image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
          name="Nguyễn Văn B"
          id="123456789"
        />
        <StudentInfor
          image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
          name="Nguyễn Văn C"
          id="123456789"
        />
        <StudentInfor
          image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
          name="Nguyễn Văn D"
          id="123456789"
        />
        <StudentInfor
          image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
          name="Nguyễn Văn E"
          id="123456789"
        />
        <StudentInfor
          image="https://cdn-icons-png.flaticon.com/512/1769/1769039.png"
          name="Nguyễn Văn F"
          id="123456789"
        />
      </div>
    </div>
  );
};
