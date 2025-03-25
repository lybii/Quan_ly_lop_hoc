interface DayProps {
  date: string;
  day: string;
}

export const Day: React.FC<DayProps> = ({ date, day }) => {
  return (
    <div className="flex h-[45px] w-[45px] flex-col items-center justify-center rounded-xl bg-gray-300">
      <div className="day">{day}</div>
      <div className="date">{date}</div>
    </div>
  );
};
