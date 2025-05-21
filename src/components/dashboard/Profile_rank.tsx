interface ProfileRankProps {
  name: string;

  score: number;
  backgroundColor: string;
}

export const ProfileRank: React.FC<ProfileRankProps> = ({
  name,

  score,
  backgroundColor,
}) => {
  return (
    <div
      className={`mb-[25px] flex h-[62px] items-center rounded-2xl ${backgroundColor} p-2`}
    >
      
      <div className="ml-4 flex flex-col">
        <h1 className="text-base font-bold">{name}</h1>
        <p className="text-sm">Điểm: {score}</p>
      </div>
    </div>
  );
};
