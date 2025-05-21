import { Link } from 'react-router-dom';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useState } from 'react';

interface AssignmentProps {
  title: string;
  description: string;
  subject: string;
  status: string;
  deadline: string;
}

const Assignment: React.FC<AssignmentProps> = ({
  title,
  description,
  subject,
  status,
  deadline,
}) => {
  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h3 className="my-auto text-xl font-semibold">{title}</h3>

        <p className="my-auto inline text-sm font-medium text-red-500">
          {subject}
        </p>
      </div>
      <p className="mx-auto">{description}</p>
      <div className="flex h-full flex-col">
        <div className="my-auto mr-4 flex h-auto w-auto justify-center rounded-lg bg-red-400 p-2">
          <p className="text-xs font-medium text-red-800">{status}</p>
        </div>
        <div className="my-auto flex items-center">
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

          <p className="mr-2 inline text-sm">{deadline}</p>
        </div>
      </div>
    </div>
  );
};

export const AssignmentList: React.FC = () => {
  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Bài tập" />
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
          <Link to="create">
            <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700">
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
              Tạo bài tập
            </button>
          </Link>
        </div>
        <Link to="1">
          <Assignment
            title="Bài tập 1"
            description="Làm bài tập 1"
            subject="Công nghệ phần mềm"
            status="Đã giao"
            deadline="Hạn nộp: 12/12/2023"
          />
        </Link>
      </div>
    </div>
  );
};

interface StudentSubmission {
  id: string;
  name: string;
  submissionDate: string;
  file?: string;
  grade?: number;
}

export const AssignmentInfor: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentSubmission | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    title: 'Bài tập 1',
    subject: 'Công nghệ phần mềm',
    deadline: '12/12/2023',
    description: `1. Sinh viên đọc bài post hướng dẫn môi trường thực hành và cài đặt
    môi trường. 2. Sinh viên tự tìm hiểu về HĐH Ubuntu và các câu lệnh...`,
  });

  // Mock data for students
  const students: StudentSubmission[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      submissionDate: '10/12/2023',
      file: 'baitap1.pdf',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      submissionDate: '11/12/2023',
      file: 'baitap1.docx',
      grade: 8.5,
    },
    { id: '3', name: 'Lê Văn C', submissionDate: '', file: '' },
  ];

  const handleGradeSubmit = (studentId: string, grade: number) => {
    // TODO: Implement grade submission to backend
    console.log(`Grade ${grade} submitted for student ${studentId}`);
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Chi tiết bài tập" />
      {/* Header section */}
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
        {/* Assignment Details Section */}
        <div className="mb-8">
          {isEditing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên bài tập
                </label>
                <input
                  type="text"
                  value={assignmentData.title}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Môn học
                </label>
                <input
                  type="text"
                  value={assignmentData.subject}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả bài tập
                </label>
                <textarea
                  value={assignmentData.description}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hạn nộp
                </label>
                <input
                  type="date"
                  value={assignmentData.deadline}
                  onChange={(e) =>
                    setAssignmentData((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>

              {/* Add other edit fields */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                >
                  Lưu
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">{assignmentData.title}</h2>
              <p className="text-gray-600">Môn học: {assignmentData.subject}</p>
              <p className="text-gray-600">
                Hạn nộp: {assignmentData.deadline}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Sửa thông tin
              </button>
            </div>
          )}
        </div>

        {/* Students List Section */}
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Danh sách sinh viên</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên sinh viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ngày nộp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.file ? 'Đã nộp' : 'Chưa nộp'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.submissionDate || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.grade || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.file && (
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          Xem bài nộp
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Submission Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Bài nộp của {selectedStudent.name}
              </h3>
              <div className="mb-4">
                <p>File: {selectedStudent.file}</p>
                <p>Ngày nộp: {selectedStudent.submissionDate}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Điểm số:
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={selectedStudent.grade}
                  className="mt-1 block w-24 rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleGradeSubmit(selectedStudent.id, 8.5); // Replace with actual grade
                    setSelectedStudent(null);
                  }}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                >
                  Lưu điểm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
