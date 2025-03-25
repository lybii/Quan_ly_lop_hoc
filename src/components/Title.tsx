interface TitleProps {
  title: string;
}

export const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="mb-4 flex items-center gap-7">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};
