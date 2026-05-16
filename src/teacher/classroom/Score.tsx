import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import api from '../../api/axiosConfig';
import * as XLSX from 'xlsx';

// Interface cho dữ liệu điểm
interface ScoreProps {
  id: string;
  name: string;
  score1: number | null; // CC
  score2: number | null; // Bài tập
  score3: number | null; // Giữa kỳ
  score4: number | null; // Thi
}

// Interface cho bài tập
interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  file: string;
  status: number;
}

// Interface cho bài nộp của sinh viên
interface StudentSubmission {
  id: number;
  file: string;
  submissionTime: string;
  status: number;
  grade: number | null;
  userId: number;
  assignmentId: number;
  userName: string;
}

// Modal để thêm điểm mới
interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (score: ScoreProps) => void;
}

// Function to format date for display
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (error) {
    return dateString;
  }
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
  const { classId } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    StudentSubmission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsMap, setStudentsMap] = useState<Record<number, any>>({});

  // Fetch assignments and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          setError('Vui lòng đăng nhập để xem điểm');
          return;
        }

        const userResponse = await api.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch assignments for this class
        const assignmentsResponse = await api.get(
          `/api/assignments/assignments/class/${classId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!Array.isArray(assignmentsResponse.data)) {
          setError('Định dạng dữ liệu bài tập không hợp lệ');
          return;
        }

        setAssignments(assignmentsResponse.data);

        // Fetch class students
        const classResponse = await api.get(`/api/classes/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (classResponse.data.success && classResponse.data.data.students) {
          const students = classResponse.data.data.students;
          const studentsById: Record<number, any> = {};

          students.forEach((student: any) => {
            if (student.user) {
              studentsById[student.user.id] = student.user;
            }
          });

          setStudentsMap(studentsById);
        }

        // If we have assignments, select the first one and load its submissions
        if (assignmentsResponse.data.length > 0) {
          const firstAssignment = assignmentsResponse.data[0];
          setSelectedAssignment(firstAssignment);

          await fetchSubmissionsForAssignment(
            firstAssignment.id,
            token,
            studentsMap
          );
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Không thể tải dữ liệu bài tập');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // Fetch submissions for a specific assignment
  const fetchSubmissionsForAssignment = async (
    assignmentId: number,
    token: string,
    studentsData: Record<number, any> = studentsMap
  ) => {
    try {
      const submissionsResponse = await api.get(
        `/api/submissions/submissions/assignment/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(submissionsResponse.data)) {
        // Map submission data and include user names
        const submissionsData = submissionsResponse.data.map(
          (submission: any) => ({
            ...submission,
            submissionTime: submission.submissionTime,
            userName:
              studentsData[submission.userId]?.userName ||
              `User ID: ${submission.userId}`,
          })
        );

        setSubmissions(submissionsData);
        setFilteredSubmissions(submissionsData);
      }
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      if (err.response && err.response.status === 401) {
        setError('Không có quyền truy cập dữ liệu bài nộp');
      } else {
        setError('Không thể tải danh sách bài nộp. Vui lòng thử lại sau.');
      }
    }
  };

  // Handle assignment selection
  const handleSelectAssignment = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSearchTerm('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem bài nộp');
      return;
    }

    await fetchSubmissionsForAssignment(assignment.id, token);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }

    const filtered = submissions.filter(
      (submission) =>
        submission.userName.toLowerCase().includes(value.toLowerCase()) ||
        submission.file.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSubmissions(filtered);
  };

  // Handle saving a grade
  const handleSaveGrade = async (submissionId: number, grade: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để chấm điểm');
    }

    // Try multiple approaches to handle potential API inconsistencies
    try {
      // First try the specific grading endpoint
      const response = await api.post(
        `/api/submissions/grade/${submissionId}`,
        { grade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Grade submission response:', response);
    } catch (gradeError) {
      console.error('Error with grade endpoint:', gradeError);

      // Fall back to the update endpoint
      const submission = submissions.find((s) => s.id === submissionId);
      if (!submission) throw new Error('Không tìm thấy bài nộp');

      await api.put(
        `/api/submissions/update/${submissionId}`,
        {
          ...submission,
          grade: grade,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Update local state
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === submissionId ? { ...sub, grade } : sub
    );

    setSubmissions(updatedSubmissions);
    setFilteredSubmissions(
      filteredSubmissions.map((sub) =>
        sub.id === submissionId ? { ...sub, grade } : sub
      )
    );
  };

  // Export grades to Excel
  const handleExportGrades = () => {
    if (!selectedAssignment) return;

    try {
      // Format data for export
      const exportData = filteredSubmissions.map((submission) => ({
        'Mã sinh viên': submission.userId,
        'Tên sinh viên': submission.userName,
        'Trạng thái': submission.status === 2 ? 'Đã nộp' : 'Chưa hoàn thành',
        File: submission.file || 'Không có file',
        'Ngày nộp': new Date(submission.submissionTime).toLocaleString('vi-VN'),
        Điểm: submission.grade !== null ? submission.grade : 'Chưa chấm',
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');

      // Generate filename
      const assignmentTitle = selectedAssignment.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 30);
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .substring(0, 19);
      const filename = `BangDiem_${assignmentTitle}_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting grades:', error);
      alert('Có lỗi xảy ra khi xuất điểm. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý điểm" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={handleSearch} />
        <div className="flex">
          {user && (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../src/assets/avatar.png'}
            />
          )}
        </div>
      </div>
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        {/* Danh sách bài tập */}
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold">Chọn bài tập</h2>
          <div className="flex flex-wrap gap-3">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <button
                  key={assignment.id}
                  onClick={() => handleSelectAssignment(assignment)}
                  className={`rounded-lg px-4 py-2 ${
                    selectedAssignment?.id === assignment.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {assignment.title}
                </button>
              ))
            ) : (
              <p className="text-gray-500">
                Không có bài tập nào trong lớp học này
              </p>
            )}
          </div>
        </div>

        {/* Thông tin bài tập đã chọn */}
        {selectedAssignment && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  {selectedAssignment.title}
                </h3>
                <p className="mt-1 text-sm text-blue-600">
                  Hạn nộp:{' '}
                  {new Date(selectedAssignment.deadline).toLocaleString(
                    'vi-VN'
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="mt-4 flex items-center md:mt-0">
                <button
                  onClick={handleExportGrades}
                  className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  disabled={filteredSubmissions.length === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách bài nộp */}
        {selectedAssignment && (
          <>
            <div className="mb-3 flex justify-between">
              <h2 className="text-xl font-semibold">Danh sách bài nộp</h2>
              <p className="text-gray-600">
                Tổng số: {filteredSubmissions.length} bài nộp
              </p>
            </div>

            {filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Sinh viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        File
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
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {submission.userName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              submission.status === 2
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {submission.status === 2
                              ? 'Đã nộp'
                              : 'Chưa hoàn thành'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {submission.file || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {formatDate(submission.submissionTime)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <span
                              className={
                                submission.grade !== null
                                  ? 'font-medium'
                                  : 'text-gray-500'
                              }
                            >
                              {submission.grade !== null
                                ? submission.grade
                                : 'Chưa chấm'}
                            </span>
                            {submission.grade !== null && (
                              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            onClick={() => {
                              // Open grade modal with current submission
                              // We would implement this with a modal similar to Assignment.tsx
                              const newGrade = prompt(
                                'Nhập điểm (0-10):',
                                submission.grade?.toString() || ''
                              );
                              if (newGrade !== null) {
                                const grade = parseFloat(newGrade);
                                if (
                                  !isNaN(grade) &&
                                  grade >= 0 &&
                                  grade <= 10
                                ) {
                                  handleSaveGrade(submission.id, grade);
                                } else {
                                  alert('Điểm phải là số từ 0 đến 10!');
                                }
                              }
                            }}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          >
                            Chấm điểm
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                {searchTerm
                  ? 'Không tìm thấy bài nộp phù hợp với từ khóa tìm kiếm'
                  : 'Chưa có bài nộp nào cho bài tập này'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
