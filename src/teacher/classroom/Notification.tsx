import { useState } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

// Modal Component để tạo thông báo
interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (notification: NotificationProps) => void;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (title && message && date) {
      onCreate({ title, message, date });
      setTitle('');
      setMessage('');
      setDate('');
      onClose();
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Tạo thông báo mới</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nội dung</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập nội dung thông báo"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

// Interface NotificationProps
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
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      message: 'Học sinh lớp có mặt đầy đủ',
      date: '12/10/2023',
      title: 'Điểm danh',
    },
    {
      message: 'Học sinh lớp có mặt đầy đủ',
      date: '12/10/2023',
      title: 'Điểm danh',
    },
    {
      message: 'Học sinh lớp có mặt đầy đủ',
      date: '12/10/2023',
      title: 'Điểm danh',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNotification = (notification: NotificationProps) => {
    setNotifications([notification, ...notifications]);
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Thông báo" />
      <div className="-mt-8 flex justify-between">
        <SearchBox />
        <div className="flex">
          <Profile
            name="TranBaLoi"
            role="Giáo viên"
            image="../../src/assets/avatar.png"
          />
        </div>
      </div>
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        <div className="flex w-full justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tạo thông báo
          </button>
        </div>
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            message={notification.message}
            date={notification.date}
            title={notification.title}
          />
        ))}
      </div>
      <CreateNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateNotification}
      />
    </div>
  );
};
