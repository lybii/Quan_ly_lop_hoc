import { useState } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';

// Interface cho dữ liệu điểm
interface ScoreProps {
  id: string;
  name: string;
  score1: number | null; // CC
  score2: number | null; // Bài tập
  score3: number | null; // Giữa kỳ
  score4: number | null; // Thi
}

// Modal để thêm điểm mới
interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (score: ScoreProps) => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [score3, setScore3] = useState('');
  const [score4, setScore4] = useState('');

  const handleSubmit = () => {
    if (name && id) {
      const scores = [score1, score2, score3, score4].map((s) =>
        s ? parseFloat(s) : null
      );
      for (const score of scores) {
        if (score !== null && (isNaN(score) || score < 0 || score > 10)) {
          alert('Điểm phải là số từ 0 đến 10 hoặc để trống!');
          return;
        }
      }
      onSave({
        id,
        name,
        score1: scores[0],
        score2: scores[1],
        score3: scores[2],
        score4: scores[3],
      });
      setName('');
      setId('');
      setScore1('');
      setScore2('');
      setScore3('');
      setScore4('');
      onClose();
    } else {
      alert('Vui lòng điền đầy đủ tên và mã học sinh!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Thêm điểm</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tên học sinh</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập tên học sinh"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mã học sinh</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập mã học sinh"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Điểm CC</label>
            <input
              type="text"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập điểm (0-10, để trống nếu chưa có)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Điểm bài tập</label>
            <input
              type="text"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập điểm (0-10, để trống nếu chưa có)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Điểm giữa kỳ</label>
            <input
              type="text"
              value={score3}
              onChange={(e) => setScore3(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập điểm (0-10, để trống nếu chưa có)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Điểm thi</label>

            <input
              type="text"
              value={score4}
              onChange={(e) => setScore4(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Nhập điểm (0-10, để trống nếu chưa có)"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-1 text-gray-800 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

// Trang quản lý điểm
export const ScoreList: React.FC = () => {
  const [scores, setScores] = useState<ScoreProps[]>([
    {
      id: '123456789',
      name: 'Nguyễn Văn A',
      score1: 8.5,
      score2: 9.0,
      score3: 7.5,
      score4: 8.0,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<ScoreProps | null>(null);

  const handleAddScore = (score: ScoreProps) => {
    setScores([score, ...scores]);
  };

  const handleEdit = (score: ScoreProps) => {
    setEditingId(score.id);
    setEditData({ ...score });
  };

  const handleSaveEdit = (id: string) => {
    if (editData) {
      const scoresToValidate = [
        editData.score1,
        editData.score2,
        editData.score3,
        editData.score4,
      ];
      for (const score of scoresToValidate) {
        if (score !== null && (isNaN(score) || score < 0 || score > 10)) {
          alert('Điểm phải là số từ 0 đến 10 hoặc để trống!');
          return;
        }
      }
      setScores(scores.map((s) => (s.id === id ? editData : s)));
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa điểm của học sinh này?')) {
      setScores(scores.filter((s) => s.id !== id));
    }
  };

  const handleEditChange = (
    field: keyof ScoreProps,
    value: string | number | null
  ) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý điểm" />
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
            Thêm điểm
          </button>
        </div>
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Mã HS</th>
              <th className="border p-2 text-left">Tên học sinh</th>
              <th className="border p-2 text-left">CC</th>
              <th className="border p-2 text-left">Bài tập</th>
              <th className="border p-2 text-left">Giữa kỳ</th>
              <th className="border p-2 text-left">Thi</th>
              <th className="border p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score.id} className="hover:bg-gray-100">
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.id || ''}
                      onChange={(e) => handleEditChange('id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    score.id
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    score.name
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.score1 ?? ''}
                      onChange={(e) =>
                        handleEditChange(
                          'score1',
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    (score.score1 ?? '-')
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.score2 ?? ''}
                      onChange={(e) =>
                        handleEditChange(
                          'score2',
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    (score.score2 ?? '-')
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.score3 ?? ''}
                      onChange={(e) =>
                        handleEditChange(
                          'score3',
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    (score.score3 ?? '-')
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <input
                      type="text"
                      value={editData?.score4 ?? ''}
                      onChange={(e) =>
                        handleEditChange(
                          'score4',
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-1"
                    />
                  ) : (
                    (score.score4 ?? '-')
                  )}
                </td>
                <td className="border p-2">
                  {editingId === score.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(score.id)}
                        className="mr-2 rounded-lg bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-lg bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(score)}
                        className="mr-2 rounded-lg bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(score.id)}
                        className="rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddScore}
      />
    </div>
  );
};
