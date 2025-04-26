import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

interface NotificationProps {
  message: string;
  date: string;
  title: string;
}
function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  date,
  title,
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
          Thông báo:
          <p className="ml-1 inline text-sm font-medium text-red-500">
            {title}
          </p>
        </p>
      </div>
      <p className="mx-auto">{message}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-2 flex items-center">
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

          <p className="ml-2 inline text-sm">{date}</p>
        </div>
      </div>
    </div>
  );
};

export const NotificationList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông báo" />
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
        <Notification
          message="Học sinh lớp có mặt đầy đủ"
          date="12/10/2023"
          title="Điểm danh"
        />
        <Notification
          message="Học sinh lớp có mặt đầy đủ"
          date="12/10/2023"
          title="Điểm danh"
        />
        <Notification
          message="Học sinh lớp  có mặt đầy đủ"
          date="12/10/2023"
          title="Điểm danh"
        />
      </div>
    </div>
  );
};
