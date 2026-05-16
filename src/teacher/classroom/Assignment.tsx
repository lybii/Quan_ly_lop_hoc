import { Link, useParams, useNavigate } from 'react-router-dom';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import * as XLSX from 'xlsx';

interface AssignmentProps {
  id: number;
  title: string;
  description: string;
  time: string;
  deadline: string;
  file: string;
  status: number;
  onDelete?: (id: number) => void;
}

interface Comment {
  id: number;
  content: string;
  time: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  userId?: number;
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

const Assignment: React.FC<AssignmentProps> = ({
  id,
  title,
  description,
  time,
  deadline,
  file,
  status,
  onDelete,
}) => {
  const formattedDeadline = formatDate(deadline);
  const statusText = status === 1 ? 'Đã giao' : 'Chưa giao';
  const statusClass =
    status === 1
      ? 'bg-green-400 text-green-800'
      : 'bg-yellow-400 text-yellow-800';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent parent click
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="m-auto my-4 flex h-[100px] w-full items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl">
      <div className="my-auto ml-5 flex flex-col">
        <h3 className="my-auto text-xl font-semibold">{title}</h3>
        <p className="my-auto inline text-sm font-medium text-red-500">
          {file}
        </p>
      </div>
      <p className="mx-auto">{description}</p>
      <div className="flex h-full flex-col">
        <div
          className={`my-auto mr-4 flex h-auto w-auto justify-center rounded-lg ${statusClass} p-2`}
        >
          <p className="text-xs font-medium">{statusText}</p>
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

          <p className="mr-2 inline text-sm">Hạn nộp: {formattedDeadline}</p>
        </div>
      </div>
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="mr-4 p-2 text-red-600 hover:text-red-800"
        title="Xóa bài tập"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
};

export const AssignmentList: React.FC = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState<AssignmentProps[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<
    AssignmentProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch assignments
        const response = await api.get(
          `/api/assignments/assignments/class/${classId}`
        );
        setAssignments(response.data);
        setFilteredAssignments(response.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch assignment data');
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setFilteredAssignments(assignments);
      return;
    }

    const filtered = assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(value.toLowerCase()) ||
        assignment.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAssignments(filtered);
  };

  const handleDeleteClick = (assignmentId: number) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      // Call delete API
      await api.delete(`/api/assignments/delete/${assignmentToDelete}`);

      // Update the assignments list
      const updatedAssignments = assignments.filter(
        (assignment) => assignment.id !== assignmentToDelete
      );
      setAssignments(updatedAssignments);
      setFilteredAssignments(updatedAssignments);

      setDeleteSuccess('Bài tập đã được xóa thành công!');

      // Close the confirmation dialog
      setShowDeleteConfirm(false);
      setAssignmentToDelete(null);
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      setDeleteError(
        error.message || 'Không thể xóa bài tập. Vui lòng thử lại sau.'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setAssignmentToDelete(null);
  };

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Bài tập" />
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
        {/* Success message */}
        {deleteSuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
            {deleteSuccess}
          </div>
        )}

        {/* Error message */}
        {deleteError && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {deleteError}
          </div>
        )}

        <div className="mb-4 flex w-full justify-end">
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

        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id}>
              <Link to={`${assignment.id}`}>
                <Assignment
                  id={assignment.id}
                  title={assignment.title}
                  description={assignment.description}
                  time={assignment.time}
                  deadline={assignment.deadline}
                  file={assignment.file}
                  status={assignment.status}
                  onDelete={handleDeleteClick}
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="p-4 text-center">Không có bài tập nào</div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Xác nhận xóa bài tập
              </h3>
              <p className="mb-6 text-gray-700">
                Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không
                thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleDeleteCancel}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  disabled={deleteLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StudentSubmission {
  id: number;
  file: string;
  submissionDate: string;
  status: number;
  grade: number | null;
  userId: number;
  assignmentId: number;
  userName?: string; // Add username for display
}

export const AssignmentInfor: React.FC = () => {
  const { classId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gradeSubmitLoading, setGradeSubmitLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [assignmentData, setAssignmentData] = useState({
    id: 0,
    title: '',
    description: '',
    file: '',
    time: '',
    deadline: '',
    status: 1,
    classId: 0,
  });
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    StudentSubmission[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsMap, setStudentsMap] = useState<Record<number, any>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [bulkGradeValue, setBulkGradeValue] = useState<string>('');
  const [isBulkGrading, setIsBulkGrading] = useState(false);
  const [bulkGradeLoading, setBulkGradeLoading] = useState(false);

  // Comments related state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const commentSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Unauthorized: Please log in');
          return;
        }

        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch assignment details
        if (assignmentId) {
          try {
            const assignmentsResponse = await api.get(
              `/api/assignments/assignments/class/${classId}`
            );

            if (
              assignmentsResponse.data &&
              Array.isArray(assignmentsResponse.data)
            ) {
              const assignment = assignmentsResponse.data.find(
                (a: any) => a.id === parseInt(assignmentId as string, 10)
              );

              if (assignment) {
                const deadlineDate = new Date(assignment.deadline);
                const formattedDeadline = deadlineDate
                  .toISOString()
                  .slice(0, 16);

                setAssignmentData({
                  ...assignment,
                  deadline: formattedDeadline,
                });
              } else {
                throw new Error('Assignment not found');
              }
            } else {
              throw new Error('Invalid assignment data format');
            }
          } catch (err) {
            console.error('Error fetching assignment:', err);
            setError('Không thể tải thông tin bài tập. Vui lòng thử lại sau.');
          }
        }

        // Fetch class students
        const classResponse = await api.get(`/api/classes/${classId}`);
        if (classResponse.data.success && classResponse.data.data.students) {
          const students = classResponse.data.data.students;
          const studentsById: Record<number, any> = {};

          students.forEach((student: any) => {
            if (student.user) {
              studentsById[student.user.id] = student.user;
            }
          });

          setStudentsMap(studentsById);

          // Fetch submissions after we have student data
          if (assignmentId) {
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
                    submissionDate: formatDate(submission.submissionTime),
                    userName:
                      studentsById[submission.userId]?.userName ||
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
                setError(
                  'Không thể tải danh sách bài nộp. Vui lòng thử lại sau.'
                );
              }
            }
          }
        }

        // Fetch comments for this assignment
        if (assignmentId) {
          try {
            const commentsResponse = await api.get(
              `/api/comments/assignment/${assignmentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (commentsResponse.data && commentsResponse.data.success) {
              // Process comments to add role information if missing
              const commentsWithRoles = await Promise.all(
                (commentsResponse.data.data || []).map(async (comment: any) => {
                  // If comment already has userRole, use it
                  if (comment.userRole) {
                    return comment;
                  }

                  // Otherwise try to fetch user info to get role
                  try {
                    if (comment.userId) {
                      const userResponse = await api.get(
                        `/api/users/${comment.userId}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      if (userResponse.data && userResponse.data.success) {
                        return {
                          ...comment,
                          userRole: userResponse.data.data.role.name,
                          userAvatar: userResponse.data.data.avatar,
                        };
                      }
                    }
                    return comment;
                  } catch (err) {
                    console.error('Error fetching comment user details:', err);
                    return comment;
                  }
                })
              );

              setComments(commentsWithRoles);
            }
          } catch (err) {
            console.error('Error fetching comments:', err);
          }
        }
      } catch (error: any) {
        console.error('Error fetching assignment data:', error);
        setError(error.message || 'Failed to load assignment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, classId]);

  useEffect(() => {
    // Filter submissions when search term changes
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = submissions.filter(
        (submission) =>
          submission.userName?.toLowerCase().includes(lowerSearchTerm) ||
          `User ID: ${submission.userId}`
            .toLowerCase()
            .includes(lowerSearchTerm)
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchTerm, submissions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(file.name);

      // Update form data with the new filename
      setAssignmentData((prev) => ({
        ...prev,
        file: file.name,
      }));
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (!assignmentId) {
        throw new Error('Assignment ID is missing');
      }

      // Format the data for the API
      const deadlineDate = new Date(assignmentData.deadline);
      const formattedDeadline = deadlineDate.toISOString();

      const updateData = {
        ...assignmentData,
        deadline: formattedDeadline,
      };

      try {
        // If there's a file to upload, handle it
        if (selectedFile) {
          // In a real implementation, you would upload the file to a server here
          // For example:
          // const formData = new FormData();
          // formData.append('file', selectedFile);
          // await api.post('/api/upload', formData);

          console.log('File would be uploaded:', selectedFile.name);
          // For now, we'll just use the filename in the assignment data
        }

        // Call the update API
        await api.put(`/api/assignments/update/${assignmentId}`, updateData);

        setSubmitSuccess(true);
        setIsEditing(false);

        // Instead of fetching again, just update our local state with the updated data
        // but format the deadline back for display
        setAssignmentData({
          ...updateData,
          deadline: deadlineDate.toISOString().slice(0, 16),
        });

        // Clear file selection state
        setSelectedFile(null);
        setFilePreview('');
      } catch (updateError: any) {
        console.error('Error during update:', updateError);
        throw new Error(`Không thể cập nhật bài tập: ${updateError.message}`);
      }
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      setSubmitError(error.message || 'Failed to update assignment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGradeSubmit = async (
    submission: StudentSubmission,
    grade: number
  ) => {
    try {
      setGradeSubmitLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: Please log in');
        return;
      }

      console.log(
        `Attempting to grade submission ${submission.id} with grade ${grade}`
      );

      let isSuccess = false;

      // Try different payload formats
      const payloadOptions = [
        { grade }, // Number format
        { grade: grade.toString() }, // String format
        { grade: grade }, // Explicit JSON format
      ];

      // Try the specific grading API endpoint with different payload formats
      for (const payload of payloadOptions) {
        if (isSuccess) break;

        try {
          console.log('Trying payload:', payload);
          const response = await api.post(
            `/api/submissions/grade/${submission.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Grade submission response:', response);
          isSuccess = true;
          break;
        } catch (gradeError: any) {
          console.error(
            `Error with grade endpoint (payload: ${JSON.stringify(payload)}):`,
            gradeError
          );
        }
      }

      // Try with FormData approach
      if (!isSuccess) {
        try {
          console.log('Trying FormData approach');
          const formData = new FormData();
          formData.append('grade', grade.toString());

          const response = await api.post(
            `/api/submissions/grade/${submission.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('FormData grade submission response:', response);
          isSuccess = true;
        } catch (formDataError: any) {
          console.error('Error with FormData approach:', formDataError);
        }
      }

      // Try with URLSearchParams approach
      if (!isSuccess) {
        try {
          console.log('Trying URLSearchParams approach');
          const params = new URLSearchParams();
          params.append('grade', grade.toString());

          const response = await api.post(
            `/api/submissions/grade/${submission.id}`,
            params,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
          console.log('URLSearchParams grade submission response:', response);
          isSuccess = true;
        } catch (urlParamsError: any) {
          console.error('Error with URLSearchParams approach:', urlParamsError);
        }
      }

      // Try a direct fetch call as last resort
      if (!isSuccess) {
        try {
          console.log('Trying direct fetch approach');
          const response = await fetch(
            `http://localhost:8080/api/submissions/grade/${submission.id}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ grade }),
            }
          );

          if (response.ok) {
            console.log('Direct fetch approach succeeded');
            isSuccess = true;
          } else {
            console.error('Direct fetch failed with status:', response.status);
          }
        } catch (fetchError: any) {
          console.error('Error with direct fetch approach:', fetchError);
        }
      }

      // If all specific endpoint attempts fail, fall back to the update endpoint
      if (!isSuccess) {
        console.log(
          'All grade endpoint attempts failed, trying update endpoint'
        );
        await api.put(
          `/api/submissions/update/${submission.id}`,
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
      setSubmissions(
        submissions.map((sub) =>
          sub.id === submission.id ? { ...sub, grade } : sub
        )
      );

      setFilteredSubmissions(
        filteredSubmissions.map((sub) =>
          sub.id === submission.id ? { ...sub, grade } : sub
        )
      );

      alert('Điểm đã được cập nhật thành công');
    } catch (error: any) {
      console.error('Error updating grade:', error);

      // Log more detailed error information
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        console.error('Response error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      if (error.response && error.response.status === 403) {
        alert(
          'Bạn không có quyền chấm điểm. Chỉ giảng viên mới có thể thực hiện chức năng này.'
        );
      } else if (error.response && error.response.status === 500) {
        alert(
          'Lỗi máy chủ khi chấm điểm. Vui lòng kiểm tra định dạng dữ liệu và thử lại sau.'
        );
      } else {
        alert('Không thể cập nhật điểm. Vui lòng thử lại sau.');
      }
    } finally {
      setGradeSubmitLoading(false);
    }
  };

  const handleDownloadFile = async (submission: StudentSubmission) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: Please log in');
        return;
      }

      // In a real implementation, you would call an API to get the file
      // For now, we'll show an alert since we don't have the actual file download API
      alert(`Tải xuống file: ${submission.file}`);

      // Example of how the actual download would work:
      // const response = await api.get(
      //   `/api/submissions/download/${submission.id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     responseType: 'blob', // Important for file downloads
      //   }
      // );
      //
      // // Create a URL for the blob
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', submission.file);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (error: any) {
      console.error('Error downloading file:', error);
      alert('Không thể tải xuống file. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentId) return;

    setDeleteLoading(true);

    try {
      // Call delete API
      await api.delete(`/api/assignments/delete/${assignmentId}`);

      // Redirect back to the assignment list
      navigate(`/teacher/classroom/${classId}/assignment`);
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      setSubmitError(
        error.message || 'Không thể xóa bài tập. Vui lòng thử lại sau.'
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleBulkGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkGradeValue(e.target.value);
  };

  const toggleSubmissionSelection = (submissionId: number) => {
    setSelectedSubmissions((prev) => {
      if (prev.includes(submissionId)) {
        return prev.filter((id) => id !== submissionId);
      } else {
        return [...prev, submissionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map((sub) => sub.id));
    }
  };

  const handleBulkGradeSubmit = async () => {
    if (!bulkGradeValue || selectedSubmissions.length === 0) {
      alert('Vui lòng chọn ít nhất một bài nộp và nhập điểm');
      return;
    }

    const grade = parseFloat(bulkGradeValue);
    if (isNaN(grade) || grade < 0 || grade > 10) {
      alert('Vui lòng nhập điểm hợp lệ (0-10)');
      return;
    }

    try {
      setBulkGradeLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: Please log in');
        return;
      }

      // Prepare payload options
      const payloadOptions = [
        { grade }, // Number format
        { grade: grade.toString() }, // String format
        { grade: grade }, // Explicit JSON format
      ];

      // Process submissions in sequence
      const failedSubmissions: number[] = [];

      for (const submissionId of selectedSubmissions) {
        try {
          // Find the submission object
          const submissionToUpdate = submissions.find(
            (s) => s.id === submissionId
          );
          if (!submissionToUpdate) {
            console.error(
              `Submission ${submissionId} not found in local state`
            );
            failedSubmissions.push(submissionId);
            continue;
          }

          let submissionSuccess = false;

          // Try different payload formats with the grading endpoint
          for (const payload of payloadOptions) {
            if (submissionSuccess) break;

            try {
              console.log(
                `Trying to grade submission ${submissionId} with payload:`,
                payload
              );
              await api.post(
                `/api/submissions/grade/${submissionId}`,
                payload,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              submissionSuccess = true;
              break;
            } catch (gradeError: any) {
              console.error(
                `Error with grade endpoint for submission ${submissionId}:`,
                gradeError
              );
            }
          }

          // Try with FormData approach
          if (!submissionSuccess) {
            try {
              console.log(
                `Trying FormData approach for submission ${submissionId}`
              );
              const formData = new FormData();
              formData.append('grade', grade.toString());

              await api.post(
                `/api/submissions/grade/${submissionId}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
              submissionSuccess = true;
            } catch (formDataError: any) {
              console.error(
                `Error with FormData approach for submission ${submissionId}:`,
                formDataError
              );
            }
          }

          // If all specific endpoint attempts fail, fall back to the update endpoint
          if (!submissionSuccess) {
            console.log(
              `All grade endpoint attempts failed for submission ${submissionId}, trying update endpoint`
            );
            await api.put(
              `/api/submissions/update/${submissionId}`,
              {
                ...submissionToUpdate,
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
        } catch (err: any) {
          console.error(`Failed to grade submission ${submissionId}:`, err);
          if (err.response) {
            console.error('Response error data:', err.response.data);
            console.error('Response error status:', err.response.status);
          }
          failedSubmissions.push(submissionId);
        }
      }

      // Update local state for successfully graded submissions
      const successfulIds = selectedSubmissions.filter(
        (id) => !failedSubmissions.includes(id)
      );

      if (successfulIds.length > 0) {
        // Update both submissions and filteredSubmissions state
        const updatedSubmissions = submissions.map((submission) =>
          successfulIds.includes(submission.id)
            ? { ...submission, grade }
            : submission
        );
        setSubmissions(updatedSubmissions);

        const updatedFilteredSubmissions = filteredSubmissions.map(
          (submission) =>
            successfulIds.includes(submission.id)
              ? { ...submission, grade }
              : submission
        );
        setFilteredSubmissions(updatedFilteredSubmissions);
      }

      // Show results
      if (failedSubmissions.length > 0) {
        alert(
          `Đã cập nhật ${
            selectedSubmissions.length - failedSubmissions.length
          } bài nộp thành công và ${failedSubmissions.length} bài nộp thất bại.`
        );
      } else {
        alert(`Đã cập nhật ${selectedSubmissions.length} bài nộp thành công.`);
      }

      // Reset bulk grading state
      setIsBulkGrading(false);
      setBulkGradeValue('');
      setSelectedSubmissions([]);
    } catch (error: any) {
      console.error('Error with bulk grading:', error);
      alert('Đã xảy ra lỗi khi cập nhật điểm hàng loạt.');
    } finally {
      setBulkGradeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const response = await api.post(
        '/api/comments',
        {
          userId: parseInt(userId),
          assignmentId: parseInt(assignmentId as string),
          content: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.success) {
        // Add the new comment to the state with user role information
        const newCommentWithRole = {
          ...response.data.data,
          userName: user?.userName,
          userRole: user?.role?.name || 'ROLE_LECTURER',
          userAvatar: user?.avatar,
          userId: parseInt(userId),
        };

        setComments([...comments, newCommentWithRole]);
        setNewComment('');

        // Scroll to the bottom of the comment section
        if (commentSectionRef.current) {
          commentSectionRef.current.scrollTop =
            commentSectionRef.current.scrollHeight;
        }
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Không thể thêm bình luận. Vui lòng thử lại sau.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentContent.trim()) return;

    try {
      setCommentLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const response = await api.put(
        `/api/comments/${editingCommentId}`,
        {
          userId: parseInt(userId),
          content: editingCommentContent.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.success) {
        // Update the comment in the state while preserving role info
        setComments(
          comments.map((comment) =>
            comment.id === editingCommentId
              ? {
                  ...comment,
                  content: editingCommentContent.trim(),
                  time: response.data.data.time, // Update time if provided in response
                }
              : comment
          )
        );
      } else {
        throw new Error('Failed to update comment');
      }

      // Reset editing state
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Không thể cập nhật bình luận. Vui lòng thử lại sau.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?'))
      return;

    try {
      setCommentLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const response = await api.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        // Remove the comment from the state
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Không thể xóa bình luận. Vui lòng thử lại sau.');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatCommentTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return timeString;
    }
  };

  const canEditComment = (comment: Comment) => {
    const userId = localStorage.getItem('userId');
    // If comment doesn't have userId, use the username to check
    if (!comment.userId) {
      return comment.userName === user?.userName;
    }
    return userId && parseInt(userId) === comment.userId;
  };

  const handleExportGrades = () => {
    try {
      // Check if there are submissions to export
      if (filteredSubmissions.length === 0) {
        alert('Không có dữ liệu bài nộp để xuất.');
        return;
      }

      // Format data for export
      const exportData = filteredSubmissions.map((submission) => ({
        'Mã sinh viên': submission.userId,
        'Tên sinh viên': submission.userName || `User ID: ${submission.userId}`,
        'Trạng thái': submission.status === 2 ? 'Đã nộp' : 'Chưa hoàn thành',
        File: submission.file || 'Không có file',
        'Ngày nộp': submission.submissionDate || 'N/A',
        Điểm: submission.grade !== null ? submission.grade : 'Chưa chấm',
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');

      // Generate filename
      const assignmentTitle = assignmentData.title
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

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Chi tiết bài tập" />
      {/* Header section */}
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
        {/* Success message */}
        {submitSuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
            Đã cập nhật bài tập thành công!
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {submitError}
          </div>
        )}

        {/* Assignment Details Section */}
        <div className="mb-8">
          {isEditing ? (
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên bài tập
                </label>
                <input
                  type="text"
                  name="title"
                  value={assignmentData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả bài tập
                </label>
                <textarea
                  name="description"
                  value={assignmentData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tập tin
                </label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {(filePreview || assignmentData.file) && (
                    <div className="mt-2 flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {filePreview || assignmentData.file}
                      </span>
                    </div>
                  )}
                  {assignmentData.file && !filePreview && (
                    <p className="text-xs text-gray-500">
                      Tập tin hiện tại: {assignmentData.file}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hạn nộp
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={assignmentData.deadline}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    setFilePreview('');
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
                  disabled={submitLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">{assignmentData.title}</h2>
              <p className="mt-2 whitespace-pre-line text-gray-600">
                {assignmentData.description}
              </p>
              {assignmentData.file && (
                <p className="mt-2 flex items-center justify-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Tập tin: {assignmentData.file}
                </p>
              )}
              <p className="mt-2 text-gray-600">
                Hạn nộp: {formatDate(assignmentData.deadline)}
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Sửa thông tin
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Xóa bài tập
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Students List Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Danh sách bài nộp</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportGrades}
                className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
                disabled={filteredSubmissions.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
              {!isBulkGrading ? (
                <button
                  onClick={() => setIsBulkGrading(true)}
                  className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
                  disabled={filteredSubmissions.length === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Chấm điểm hàng loạt
                </button>
              ) : (
                <>
                  <div className="flex items-center rounded-lg border border-gray-300 bg-white px-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={bulkGradeValue}
                      onChange={handleBulkGradeChange}
                      className="w-16 p-1 text-sm focus:outline-none"
                      placeholder="0-10"
                      disabled={bulkGradeLoading}
                    />
                    <span className="text-xs text-gray-500">/ 10</span>
                  </div>
                  <button
                    onClick={handleBulkGradeSubmit}
                    className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
                    disabled={
                      selectedSubmissions.length === 0 ||
                      !bulkGradeValue ||
                      bulkGradeLoading
                    }
                  >
                    {bulkGradeLoading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Lưu ({selectedSubmissions.length})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsBulkGrading(false);
                      setSelectedSubmissions([]);
                      setBulkGradeValue('');
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={bulkGradeLoading}
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isBulkGrading && (
                    <th className="px-2 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedSubmissions.length ===
                            filteredSubmissions.length &&
                          filteredSubmissions.length > 0
                        }
                        onChange={handleSelectAll}
                        disabled={
                          filteredSubmissions.length === 0 || bulkGradeLoading
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên sinh viên
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
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className={
                        isBulkGrading &&
                        selectedSubmissions.includes(submission.id)
                          ? 'bg-blue-50'
                          : ''
                      }
                    >
                      {isBulkGrading && (
                        <td className="whitespace-nowrap px-2 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.includes(
                              submission.id
                            )}
                            onChange={() =>
                              toggleSubmissionSelection(submission.id)
                            }
                            disabled={bulkGradeLoading}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      )}
                      <td className="whitespace-nowrap px-6 py-4">
                        {submission.userName || `User ID: ${submission.userId}`}
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
                        {submission.submissionDate || '-'}
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
                          onClick={() => setSelectedStudent(submission)}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          disabled={bulkGradeLoading}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isBulkGrading ? 7 : 6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? 'Không tìm thấy kết quả phù hợp'
                        : 'Chưa có bài nộp nào cho bài tập này'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="mb-4 text-xl font-semibold">
            Bình luận ({comments.length})
          </h3>

          {/* Comments list */}
          <div
            ref={commentSectionRef}
            className="mb-4 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 rounded-lg bg-white p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={
                          comment.userAvatar || '../../src/assets/avatar.png'
                        }
                        alt="Avatar"
                        className="mr-2 h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {comment.userName || `User ${comment.userId}`}
                          </p>
                          <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                            {comment.userRole === 'ROLE_LECTURER' ||
                            comment.userRole === 'LECTURER'
                              ? 'Giảng viên'
                              : comment.userRole === 'ROLE_ADMIN' ||
                                  comment.userRole === 'ADMIN'
                                ? 'Quản trị viên'
                                : 'Sinh viên'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatCommentTime(comment.time)}
                        </p>
                      </div>
                    </div>

                    {canEditComment(comment) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                          className="text-blue-600 hover:text-blue-800"
                          disabled={commentLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={commentLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) =>
                          setEditingCommentContent(e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        disabled={commentLoading}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingCommentContent('');
                          }}
                          className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300"
                          disabled={commentLoading}
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleUpdateComment}
                          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                          disabled={commentLoading}
                        >
                          {commentLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">{comment.content}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </div>
            )}
          </div>

          {/* Add comment form */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận của bạn..."
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              rows={3}
              disabled={commentLoading}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddComment}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={!newComment.trim() || commentLoading}
              >
                {commentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </div>
          </div>
        </div>

        {/* Student Submission Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Bài nộp của{' '}
                {selectedStudent.userName ||
                  `User ID: ${selectedStudent.userId}`}
              </h3>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <p>File: {selectedStudent.file}</p>
                  {selectedStudent.file && (
                    <button
                      onClick={() => handleDownloadFile(selectedStudent)}
                      className="ml-2 rounded-lg bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                      disabled={gradeSubmitLoading}
                    >
                      Tải xuống
                    </button>
                  )}
                </div>
                <p>Ngày nộp: {selectedStudent.submissionDate}</p>
                <p>
                  Trạng thái:{' '}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedStudent.status === 2
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedStudent.status === 2
                      ? 'Đã nộp'
                      : 'Chưa hoàn thành'}
                  </span>
                </p>
              </div>
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Điểm số:
                  </label>
                  {selectedStudent.grade !== null && (
                    <div className="flex items-center text-sm text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Đã chấm điểm
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    defaultValue={
                      selectedStudent.grade !== null
                        ? selectedStudent.grade
                        : ''
                    }
                    id="gradeInput"
                    className="mt-1 block w-24 rounded-md border border-gray-300 p-2"
                    placeholder="0-10"
                    disabled={gradeSubmitLoading}
                  />
                  <div className="ml-2 text-sm text-gray-500">
                    Thang điểm: 0-10
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Nhập điểm số và nhấn "Lưu điểm" để cập nhật
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
                  disabled={gradeSubmitLoading}
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const gradeInput = document.getElementById(
                      'gradeInput'
                    ) as HTMLInputElement;
                    const grade = parseFloat(gradeInput.value);
                    if (!isNaN(grade) && grade >= 0 && grade <= 10) {
                      handleGradeSubmit(selectedStudent, grade);
                    } else {
                      alert('Vui lòng nhập điểm hợp lệ (0-10)');
                    }
                  }}
                  disabled={gradeSubmitLoading}
                  className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  {gradeSubmitLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Lưu điểm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Xác nhận xóa bài tập
              </h3>
              <p className="mb-6 text-gray-700">
                Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không
                thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleDeleteCancel}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  disabled={deleteLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
