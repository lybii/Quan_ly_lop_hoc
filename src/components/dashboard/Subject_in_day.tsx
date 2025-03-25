interface SubjectInDayProps {
  id: number;
  subject: string;
  time: string;
}

export const SubjectInDay: React.FC<SubjectInDayProps> = ({
  id,
  subject,
  time,
}) => {
  return (
    <div className="mb-6 mt-2 flex h-16 w-auto rounded-xl bg-gray-300 p-2">
      <div className="flex h-auto w-9 items-center justify-center border-r-2 border-zinc-500 text-xl font-bold">
        {id}
      </div>
      <div className="ml-3 flex flex-col gap-1">
        <div className="text-sm font-bold">{subject}</div>
        <div className="text-xs">{time}</div>
      </div>
    </div>
  );
};
