import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

interface ScoreProps {
  id: string;
  name: string;
  score1: any;
  score2: any;
  score3: any;
  score4: any;
}

const Score: React.FC<ScoreProps> = ({
  name,
  id,
  score1,
  score2,
  score3,
  score4,
}) => {
  return (
    <div className="m-auto my-4 rounded-lg border border-gray-400 bg-gray-100 shadow-xl">
      <h2 className="mb-4 ml-4 text-lg font-semibold text-gray-800">
        {name} - {id}
      </h2>
      <div className="mx-4 my-2 flex justify-between space-x-4">
        <div className="flex-1 rounded-xl border border-gray-700 p-3 text-center">
          <p className="text-sm text-gray-600">CC</p>
          <p className="text-lg font-medium">{score1}</p>
        </div>
        <div className="flex-1 rounded-xl border border-gray-700 p-3 text-center">
          <p className="text-sm text-gray-600">Bài tập</p>
          <p className="text-lg font-medium">{score2}</p>
        </div>
        <div className="flex-1 rounded-xl border border-gray-700 p-3 text-center">
          <p className="text-sm text-gray-600">Giữa kỳ</p>
          <p className="text-lg font-medium">{score3}</p>
        </div>
        <div className="flex-1 rounded-xl border border-gray-700 p-3 text-center">
          <p className="text-sm text-gray-600">Thi</p>
          <p className="text-lg font-medium">{score4}</p>
        </div>
      </div>
    </div>
  );
};

export const ScoreList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Điểm" />
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
        <Score
          id="123456789"
          name="Nguyễn Văn A"
          score1={8.5}
          score2={9.0}
          score3={7.5}
          score4={8.0}
        />
      </div>
    </div>
  );
};
