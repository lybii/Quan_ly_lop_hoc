interface DayProps {
  date: string;
  day: string;
}

const Day: React.FC<DayProps> = ({ date, day }) => {
  return (
    <div className="flex h-[45px] w-[45px] flex-col items-center justify-center rounded-xl bg-gray-300">
      <div className="day">{day}</div>
      <div className="date">{date}</div>
    </div>
  );
};

export const DateList: React.FC = () => {
  const getDates = () => {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date: date.getDate().toString(),
        day: date.toLocaleString('vi-VN', { weekday: 'short' }),
      };
    });
  };

  return getDates().map((item, index) => (
    <Day key={index} date={item.date} day={item.day} />
  ));
};
