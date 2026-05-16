interface SubjectInDayProps {
  id: number;
  subject: string;
  time: string;
  room?: string;
}

export const SubjectInDay: React.FC<SubjectInDayProps> = ({
  id,
  subject,
  time,
  room,
}) => {
  return (
    <div className="mb-4 flex h-auto min-h-16 w-auto rounded-xl bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
      <div className="flex h-auto w-9 items-center justify-center border-r-2 border-zinc-400 text-xl font-bold text-blue-600">
        {id}
      </div>
      <div className="ml-3 flex flex-col gap-1">
        <div className="text-sm font-bold">{subject}</div>
        <div className="text-xs flex items-center gap-2">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {time}
          </span>
          
          {room && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              {room}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
