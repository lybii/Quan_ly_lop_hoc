import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

interface AssignmentGrade {
  id: number;
  title: string;
  description: string;
  deadline: string;
  file: string;
  submissionId: number;
  submissionFile: string | null;
  submissionDate: string | null;
  grade: number | null;
  status: string;
}

interface ScoreCardProps {
  title: string;
  value: number | string;
  maxValue?: number;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  value,
  maxValue = 10,
  className = '',
}) => {
  const getColorClass = () => {
    if (typeof value === 'string') return 'bg-gray-100 text-gray-700';

    if (value >= 8) return 'bg-green-100 text-green-800';
    if (value >= 6.5) return 'bg-blue-100 text-blue-800';
    if (value >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div
      className={`rounded-xl border border-gray-300 p-3 text-center ${getColorClass()} ${className}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-lg font-semibold">
        {typeof value === 'number' ? value : value}
        {typeof value === 'number' && maxValue && (
          <span className="text-sm text-gray-500">/{maxValue}</span>
        )}
      </p>
    </div>
  );
};

const AssignmentScoreRow: React.FC<{ assignment: AssignmentGrade }> = ({
  assignment,
}) => {
  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="my-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0 md:w-1/3">
          <h3 className="text-lg font-medium text-gray-800">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-500">
            Hạn nộp: {formatDate(assignment.deadline)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:w-2/3 md:justify-end">
          <ScoreCard
            title="Trạng thái"
            value={assignment.status}
            className="min-w-28"
          />

          {assignment.submissionFile && (
            <ScoreCard
              title="File nộp"
              value={assignment.submissionFile}
              className="min-w-28"
            />
          )}

          {assignment.submissionDate && (
            <ScoreCard
              title="Ngày nộp"
              value={formatDate(assignment.submissionDate)}
              className="min-w-28"
            />
          )}

          <ScoreCard
            title="Điểm"
            value={assignment.grade !== null ? assignment.grade : 'Chưa chấm'}
            className="min-w-28"
          />
        </div>
      </div>
    </div>
  );
};

export const ScoreList: React.FC = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState<AssignmentGrade[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<
    AssignmentGrade[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({
    totalAssignments: 0,
    submitted: 0,
    graded: 0,
    averageGrade: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user data
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          setError('Vui lòng đăng nhập để xem điểm');
          return;
        }

        // Fetch user info
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

        // Create assignment grade data structure
        const assignmentData: AssignmentGrade[] = assignmentsResponse.data.map(
          (assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            deadline: assignment.deadline,
            file: assignment.file,
            submissionId: 0,
            submissionFile: null,
            submissionDate: null,
            grade: null,
            status: 'Chưa nộp',
          })
        );

        // Fetch all submissions for each assignment
        const assignmentsWithSubmissions = await Promise.all(
          assignmentData.map(async (assignment) => {
            try {
              const submissionsResponse = await api.get(
                `/api/submissions/submissions/assignment/${assignment.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (Array.isArray(submissionsResponse.data)) {
                // Find user's submission for this assignment
                const userSubmission = submissionsResponse.data.find(
                  (sub: any) => sub.userId === parseInt(userId as string)
                );

                if (userSubmission) {
                  return {
                    ...assignment,
                    submissionId: userSubmission.id,
                    submissionFile: userSubmission.file,
                    submissionDate: userSubmission.submissionTime,
                    grade: userSubmission.grade,
                    status:
                      userSubmission.status === 2
                        ? 'Đã nộp'
                        : 'Chưa hoàn thành',
                  };
                }
              }

              return assignment;
            } catch (error) {
              console.error(
                `Error fetching submissions for assignment ${assignment.id}:`,
                error
              );
              return assignment;
            }
          })
        );

        // Calculate summary statistics
        const submittedCount = assignmentsWithSubmissions.filter(
          (a) => a.status === 'Đã nộp'
        ).length;
        const gradedAssignments = assignmentsWithSubmissions.filter(
          (a) => a.grade !== null
        );
        const gradedCount = gradedAssignments.length;
        const totalGrades = gradedAssignments.reduce(
          (sum, a) => sum + (a.grade || 0),
          0
        );
        const avgGrade =
          gradedCount > 0 ? +(totalGrades / gradedCount).toFixed(2) : 0;

        setSummary({
          totalAssignments: assignmentsWithSubmissions.length,
          submitted: submittedCount,
          graded: gradedCount,
          averageGrade: avgGrade,
        });

        setAssignments(assignmentsWithSubmissions);
        setFilteredAssignments(assignmentsWithSubmissions);
      } catch (error: any) {
        console.error('Error fetching score data:', error);
        setError(error.message || 'Không thể tải dữ liệu điểm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredAssignments(assignments);
      return;
    }

    const filtered = assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(value.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAssignments(filtered);
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải dữ liệu điểm...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Điểm số bài tập" />
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
        {/* Thống kê tổng quan */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h2 className="mb-3 text-xl font-semibold text-blue-800">
            Tổng quan điểm số
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <ScoreCard
              title="Tổng số bài tập"
              value={summary.totalAssignments.toString()}
              className="bg-white"
            />
            <ScoreCard
              title="Đã nộp"
              value={`${summary.submitted}/${summary.totalAssignments}`}
              className="bg-white"
            />
            <ScoreCard
              title="Đã chấm điểm"
              value={`${summary.graded}/${summary.totalAssignments}`}
              className="bg-white"
            />
            <ScoreCard
              title="Điểm trung bình"
              value={summary.averageGrade}
              className="bg-white"
            />
          </div>
        </div>

        {/* Danh sách bài tập và điểm */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Chi tiết điểm bài tập</h2>

          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <AssignmentScoreRow key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
              {searchTerm
                ? 'Không tìm thấy bài tập phù hợp'
                : 'Không có bài tập nào trong lớp học này'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
