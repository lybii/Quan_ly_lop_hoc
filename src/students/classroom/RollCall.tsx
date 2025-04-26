import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

interface RollCallProps {
  genre: string;
  id: string;
  description: string;
  date: string;
  classs: string;
  status: string;
  time: string;
}
function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

const RollCall: React.FC<RollCallProps> = ({
  genre,
  id,
  description,
  classs,
  date,
  status,
  time,
}) => {
  const dayofWeek = parseDate(date).getDay();

  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const day = days[dayofWeek];
  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h1 className="my-auto text-xl font-semibold">
          {day}, ngày {date}
        </h1>
        <p className="my-auto text-sm font-normal">
          Loại hình học tập:
          <p className="ml-1 inline text-sm font-medium text-red-500">
            {genre}
          </p>
        </p>
        <div className="my-auto flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p className="ml-2 inline text-sm">{classs}</p>
        </div>
      </div>
      <p className="mx-auto">{description}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-4 flex h-auto w-auto justify-start rounded-lg bg-red-400 p-2">
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

          <p className="ml-2 inline text-sm">{time}</p>
        </div>
      </div>
    </div>
  );
};

export const RollCallList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông tin điểm danh" />
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
        <RollCall
          genre="Lý thuyết"
          id="1"
          description="Tìm hiểu về công nghệ thông tin"
          classs="501-A2"
          date="01/04/2025"
          status="Chưa điểm danh"
          time="8:00 - 10:00"
        />
      </div>
    </div>
  );
};
