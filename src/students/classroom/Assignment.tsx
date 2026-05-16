import { Link, useParams } from 'react-router-dom';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';

interface AssignmentProps {
  id: number;
  title: string;
  description: string;
  time: string;
  deadline: string;
  file: string;
  status: number;
}

interface Comment {
  id: number;
  content: string;
  time: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  userId?: number;
}

// Add interface for student submission
interface Submission {
  id?: number;
  file: string;
  submissionTime: string;
  status: number;
  grade: number | null;
  userId: number;
  assignmentId: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

const Assignment: React.FC<AssignmentProps> = ({
  id,
  title,
  description,
  time,
  deadline,
  file,
  status,
}) => {
  const formattedDeadline = formatDate(deadline);
  const statusText = status === 1 ? 'Đã nộp' : 'Chưa nộp';
  const statusClass =
    status === 1 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/student/classroom/${classId}/assignment/${assignment.id}`}
            >
              <Assignment
                id={assignment.id}
                title={assignment.title}
                description={assignment.description}
                time={assignment.time}
                deadline={assignment.deadline}
                file={assignment.file}
                status={assignment.status}
              />
            </Link>
          ))
        ) : (
          <div className="p-4 text-center">Không có bài tập nào</div>
        )}
      </div>
    </div>
  );
};

export const AssignmentInfor: React.FC = () => {
  const { classId, assignmentId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<AssignmentProps | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Comments state
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
                (a: any) => a.id === parseInt(assignmentId, 10)
              );

              if (assignment) {
                setAssignment(assignment);
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

        // Fetch all submissions for this assignment
        if (userId && assignmentId) {
          try {
            // Get all submissions for this assignment
            const submissionsResponse = await api.get(
              `/api/submissions/submissions/assignment/${assignmentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (Array.isArray(submissionsResponse.data)) {
              // Find the latest submission by this user
              const userSubmissions = submissionsResponse.data
                .filter((sub: any) => sub.userId === parseInt(userId))
                .sort(
                  (a: any, b: any) =>
                    new Date(b.submissionTime).getTime() -
                    new Date(a.submissionTime).getTime()
                );

              if (userSubmissions.length > 0) {
                const latestSubmission = userSubmissions[0];
                setSubmission(latestSubmission);
                setFilePreview(latestSubmission.file);
                setSubmissionStatus(
                  latestSubmission.grade !== null
                    ? `Đã nộp - Điểm: ${latestSubmission.grade}`
                    : 'Đã nộp - Chưa chấm điểm'
                );
              }
            }
          } catch (err) {
            console.error('Error fetching submissions:', err);
            // Not finding a submission is not an error
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
                          userRole: user.role.name,
                          userAvatar: user.avatar,
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
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, classId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file để nộp bài');
      return;
    }

    try {
      setSubmitLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token || !assignmentId) {
        alert('Thiếu thông tin người dùng hoặc bài tập');
        return;
      }

      const currentTime = new Date().toISOString();

      let response;
      if (submission && submission.id) {
        // Update existing submission
        // For updates, we must maintain all original fields and only change the file
        const updateData = {
          ...submission,
          file: selectedFile.name,
          submissionTime: currentTime,
          // Keep the existing status, grade, userId, and assignmentId
          status: submission.status,
          grade: submission.grade,
          userId: submission.userId,
          assignmentId: submission.assignmentId,
        };

        response = await api.put(
          `/api/submissions/update/${submission.id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Create new submission
        const submissionData = {
          file: selectedFile.name,
          submissionTime: currentTime,
          status: 2, // Submitted status
          grade: null, // Grade will be set by lecturer
          userId: parseInt(userId),
          assignmentId: parseInt(assignmentId),
        };

        response = await api.post('/api/submissions/add', submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // API returns the submission object directly
      if (response.data && response.data.id) {
        alert(
          submission && submission.id
            ? 'Đã cập nhật tên file bài nộp thành công!'
            : 'Đã nộp bài tập thành công!'
        );

        // The response.data is the updated submission object
        const updatedSubmission = response.data;

        setSubmission(updatedSubmission);
        setFilePreview(updatedSubmission.file);

        setSubmissionStatus(
          updatedSubmission.grade !== null
            ? `Đã nộp - Điểm: ${updatedSubmission.grade}`
            : 'Đã nộp - Chưa chấm điểm'
        );

        setIsEditing(false);
      } else {
        throw new Error('Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Lỗi khi nộp bài tập. Vui lòng thử lại sau.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!submission || !submission.id) {
      alert('Không có bài nộp để xóa');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa bài nộp này không?')) {
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const response = await api.delete(
        `/api/submissions/delete/${submission.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // For delete, the API returns a success message
      if (response.status === 200) {
        alert('Xóa bài nộp thành công');
        setSubmission(null);
        setSelectedFile(null);
        setFilePreview('');
        setSubmissionStatus('');
      } else {
        throw new Error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Lỗi khi xóa bài nộp. Vui lòng thử lại sau.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const isDeadlinePassed = () => {
    if (!assignment) return false;

    const now = new Date();
    const deadline = new Date(assignment.deadline);
    return now > deadline;
  };

  // Comment functions
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
          userRole: user.role.name,
          userAvatar: user.avatar,
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

  // Add helpful message for students
  const renderSubmissionInfo = () => {
    return (
      <div className="mb-3 mt-2 rounded bg-blue-50 px-2 py-1 text-sm text-blue-700">
        <p className="flex items-center">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {submission
            ? 'Bạn có thể chỉnh sửa tên file bài nộp cho đến khi giảng viên chấm điểm.'
            : 'Mỗi sinh viên chỉ được nộp một bài. Sau khi nộp, bạn vẫn có thể chỉnh sửa tên file.'}
        </p>
      </div>
    );
  };

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Bài tập" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={() => {}} />
        <div className="flex">
          {user ? (
            <Profile
              name={user.userName}
              role={user.role.name}
              image={user.avatar || '../../src/assets/avatar.png'}
            />
          ) : (
            <Profile
              name="Sinh viên"
              role="STUDENT"
              image="../../src/assets/avatar.png"
            />
          )}
        </div>
      </div>
      <div className="no-scrollbar h-screen w-full overflow-auto rounded-2xl bg-white p-4">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">
            {assignment?.title || 'Bài tập'}
          </h2>
          <p className="text-gray-600">
            Hạn nộp: {assignment ? formatDate(assignment.deadline) : 'N/A'}
          </p>
          {isDeadlinePassed() && (
            <p className="mt-2 font-medium text-red-500">Đã quá hạn nộp bài</p>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Mô tả bài tập:</h3>
          <p className="mt-2">{assignment?.description || 'Không có mô tả'}</p>
        </div>

        {/* Nộp tập tin */}
        <div className="flex w-full justify-center p-5">
          <div className="w-full max-w-2xl rounded border border-gray-300 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {submission ? 'Bài đã nộp' : 'Nộp tập tin'}
              </h3>
              {submission && (
                <div className="text-sm font-medium text-blue-600">
                  {submissionStatus}
                </div>
              )}
              <div className="flex gap-2">
                {submission && !isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded p-1 hover:bg-gray-200"
                      disabled={isDeadlinePassed() || submission.grade !== null}
                      title={
                        isDeadlinePassed()
                          ? 'Đã quá hạn nộp bài'
                          : submission.grade !== null
                            ? 'Bài đã được chấm điểm, không thể chỉnh sửa'
                            : 'Chỉnh sửa tên file bài nộp'
                      }
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={handleDeleteSubmission}
                      className="rounded p-1 text-red-500 hover:bg-gray-200"
                      disabled={isDeadlinePassed() || submission.grade !== null}
                      title={
                        isDeadlinePassed()
                          ? 'Đã quá hạn nộp bài'
                          : submission.grade !== null
                            ? 'Bài đã được chấm điểm, không thể xóa'
                            : 'Xóa bài nộp'
                      }
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </>
                )}
                {(!submission || isEditing) && (
                  <button className="rounded p-1 hover:bg-gray-200">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {renderSubmissionInfo()}

            {(!submission || isEditing) && !isDeadlinePassed() ? (
              <>
                <div
                  className="mb-4 flex h-40 items-center justify-center border-2 border-dashed border-gray-300"
                  onClick={() =>
                    document.getElementById('file-upload')?.click()
                  }
                >
                  {filePreview ? (
                    <div className="flex flex-col items-center">
                      <svg
                        className="mb-2 h-10 w-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <p className="text-center">{filePreview}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mb-2 h-10 w-10 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <p className="text-center text-gray-500">
                        Nhấp để chọn file hoặc kéo và thả file vào đây
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mb-4 flex justify-between text-sm text-gray-600">
                  <p>
                    Chỉ lưu tên file, không tải lên nội dung file. Kích cỡ tên
                    tối đa: 255 ký tự.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !selectedFile || submitLoading || isDeadlinePassed()
                    }
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {submitLoading
                      ? 'Đang nộp...'
                      : submission
                        ? 'Cập nhật bài nộp'
                        : 'Nộp bài'}
                  </button>
                  <button
                    onClick={() => {
                      if (submission) {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setFilePreview(submission.file);
                      } else {
                        setSelectedFile(null);
                        setFilePreview('');
                      }
                    }}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                    disabled={submitLoading}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                {submission ? (
                  <>
                    <div className="mb-6 flex items-center justify-center">
                      <svg
                        className="mr-3 h-12 w-12 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <div className="text-left">
                        <h4 className="font-semibold">
                          Đã nộp: {submission.file}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Thời gian nộp:{' '}
                          {new Date(submission.submissionTime).toLocaleString(
                            'vi-VN'
                          )}
                        </p>
                        {submission.grade !== null && (
                          <p className="mt-2 font-medium text-blue-600">
                            Điểm: {submission.grade}/10
                          </p>
                        )}
                      </div>
                    </div>
                    {!isEditing &&
                      !isDeadlinePassed() &&
                      submission.grade === null && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          Chỉnh sửa bài nộp
                        </button>
                      )}
                  </>
                ) : (
                  <>
                    <svg
                      className="h-20 w-20 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-red-500">
                      {isDeadlinePassed()
                        ? 'Đã quá hạn nộp bài'
                        : 'Bạn chưa nộp bài tập này'}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {isDeadlinePassed()
                        ? 'Không thể nộp bài sau thời hạn'
                        : 'Vui lòng nộp bài trước thời hạn'}
                    </p>
                  </>
                )}
              </div>
            )}
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
      </div>
    </div>
  );
};
