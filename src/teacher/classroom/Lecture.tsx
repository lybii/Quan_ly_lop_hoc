import { useState, useEffect } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import axios from 'axios';

// Component Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureProps;
  onUpdate?: (lecture: LectureProps) => void;
}

// Edit Lecture Modal
interface EditLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureProps;
  onSave: (updatedLecture: LectureProps) => void;
}

// Attendance Modal
interface AttendanceManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureId: number;
  classId: number;
}

// Notification Modal
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
}

interface LectureProps {
  id: number;
  title: string;
  description: string;
  file: string;
  startTime: string;
  endTime: string;
  status: number;
}

interface Student {
  id: number;
  user: {
    id: number;
    userName: string;
    email: string;
    code: string;
    status: number;
  };
  classId: number;
}

interface Attendance {
  id: number;
  userId: number;
  lectureId: number;
  status: number;
  userName?: string;
  userCode?: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function formatTime(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
}

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  return days[date.getDay()];
}

const EditLectureModal: React.FC<EditLectureModalProps> = ({
  isOpen,
  onClose,
  lecture,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: lecture.title,
    description: lecture.description,
    file: lecture.file,
    startTime: new Date(lecture.startTime).toISOString().slice(0, 16),
    endTime: new Date(lecture.endTime).toISOString().slice(0, 16),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLecture = {
      ...lecture,
      title: formData.title,
      description: formData.description,
      file: formData.file,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };
    onSave(updatedLecture);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/2 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Chỉnh sửa buổi học</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block font-bold">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold">Tài liệu</label>
            <input
              type="text"
              name="file"
              value={formData.file}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-bold">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-bold">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Không tìm thấy token xác thực');
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/classes/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setStudents(response.data.data.students || []);
        } else {
          throw new Error('Không thể tải danh sách sinh viên');
        }
      } catch (error: any) {
        console.error('Error fetching students:', error);
        setError('Không thể tải danh sách sinh viên');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [isOpen, classId]);

  const handleSendNotification = async () => {
    if (!title || !content) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // 1. Create notification
      const notificationResponse = await axios.post(
        'http://localhost:8080/api/notifications/add',
        {
          title,
          content,
          status: 1,
          userId: parseInt(userId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!notificationResponse.data || !notificationResponse.data.id) {
        throw new Error('Tạo thông báo thất bại');
      }

      const notificationId = notificationResponse.data.id;

      // 2. Send notification to all students in the class
      const studentUserIds = students.map((student) => student.user.id);

      if (studentUserIds.length > 0) {
        await axios.post(
          'http://localhost:8080/api/user-notifications/add',
          {
            notificationId,
            userIds: studentUserIds,
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        alert('Đã gửi thông báo thành công!');
        setTitle('');
        setContent('');
        onClose();
      } else {
        alert('Không có sinh viên nào trong lớp để gửi thông báo');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      setError(error.message || 'Đã xảy ra lỗi khi gửi thông báo');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/2 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Gửi thông báo cho lớp học</h2>

        {loading ? (
          <div className="text-center">Đang tải dữ liệu sinh viên...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <p>Số sinh viên sẽ nhận thông báo: {students.length}</p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-bold">Tiêu đề thông báo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Nhập tiêu đề thông báo"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-bold">Nội dung thông báo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
                rows={4}
                placeholder="Nhập nội dung thông báo"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                disabled={sending}
              >
                Hủy
              </button>
              <button
                onClick={handleSendNotification}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={sending}
              >
                {sending ? 'Đang gửi...' : 'Gửi thông báo'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AttendanceManagementModal: React.FC<AttendanceManagementModalProps> = ({
  isOpen,
  onClose,
  lectureId,
  classId,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Không tìm thấy token xác thực');
          return;
        }

        // Fetch students in the class
        const classResponse = await axios.get(
          `http://localhost:8080/api/classes/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!classResponse.data.success) {
          throw new Error('Không thể tải danh sách sinh viên');
        }

        const classStudents = classResponse.data.data.students || [];
        setStudents(classStudents);

        // Fetch existing attendance records for this lecture
        try {
          const attendanceResponse = await axios.get(
            `http://localhost:8080/api/attendances/by-lecture/${lectureId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (attendanceResponse.data) {
            setAttendances(attendanceResponse.data);
          }
        } catch (err) {
          console.error('Error fetching attendance records:', err);
          // Continue even if attendance fetch fails - may be first time taking attendance
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu điểm danh');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, lectureId, classId]);

  // Check if a student is marked as present
  const isStudentPresent = (userId: number) => {
    const attendance = attendances.find((att) => att.userId === userId);
    return attendance ? attendance.status === 1 : false;
  };

  // Get attendance ID if exists
  const getAttendanceId = (userId: number) => {
    const attendance = attendances.find((att) => att.userId === userId);
    return attendance ? attendance.id : null;
  };

  // Toggle attendance status for a student
  const toggleAttendance = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      const attendanceId = getAttendanceId(userId);
      const currentStatus = isStudentPresent(userId);
      const newStatus = currentStatus ? 0 : 1;

      if (attendanceId) {
        // Update existing attendance record
        await axios.put(
          `http://localhost:8080/api/attendances/status/${attendanceId}?status=${newStatus}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state
        setAttendances((prev) =>
          prev.map((att) =>
            att.userId === userId ? { ...att, status: newStatus } : att
          )
        );
      } else {
        // Create new attendance record
        const response = await axios.post(
          'http://localhost:8080/api/attendances/add',
          {
            userId,
            lectureId,
            status: newStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Add new attendance to local state
        if (response.data) {
          setAttendances((prev) => [
            ...prev,
            {
              id: response.data.id || Date.now(), // Use response ID or fallback
              userId,
              lectureId,
              status: newStatus,
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error toggling attendance:', error);
      alert('Lỗi khi cập nhật trạng thái điểm danh');
    }
  };

  // Save all attendance records at once
  const handleSaveAll = async () => {
    try {
      setSavingAttendance(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // For students without attendance records, create them
      const promises = students.map(async (student) => {
        const userId = student.user.id;
        const attendanceId = getAttendanceId(userId);
        const isPresent = isStudentPresent(userId);

        if (!attendanceId) {
          // Create new attendance record
          return axios.post(
            'http://localhost:8080/api/attendances/add',
            {
              userId,
              lectureId,
              status: isPresent ? 1 : 0,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      alert('Đã lưu điểm danh thành công!');
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Lỗi khi lưu điểm danh!');
    } finally {
      setSavingAttendance(false);
    }
  };

  // Mark all students as present
  const markAllPresent = () => {
    const updatedAttendances = [...attendances];

    students.forEach((student) => {
      const userId = student.user.id;
      const existingIndex = updatedAttendances.findIndex(
        (att) => att.userId === userId
      );

      if (existingIndex >= 0) {
        updatedAttendances[existingIndex].status = 1;
      } else {
        updatedAttendances.push({
          id: Date.now() + userId, // Temporary ID
          userId,
          lectureId,
          status: 1,
        });
      }
    });

    setAttendances(updatedAttendances);
  };

  // Mark all students as absent
  const markAllAbsent = () => {
    const updatedAttendances = [...attendances];

    students.forEach((student) => {
      const userId = student.user.id;
      const existingIndex = updatedAttendances.findIndex(
        (att) => att.userId === userId
      );

      if (existingIndex >= 0) {
        updatedAttendances[existingIndex].status = 0;
      } else {
        updatedAttendances.push({
          id: Date.now() + userId, // Temporary ID
          userId,
          lectureId,
          status: 0,
        });
      }
    });

    setAttendances(updatedAttendances);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-2/3 rounded-lg bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold">Điểm danh sinh viên</h2>

          {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg">
                  Tổng số sinh viên:{' '}
                  <span className="font-bold">{students.length}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={markAllPresent}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    disabled={savingAttendance}
                  >
                    Có mặt tất cả
                  </button>
                  <button
                    onClick={markAllAbsent}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    disabled={savingAttendance}
                  >
                    Vắng tất cả
                  </button>
                </div>
              </div>
              <div
                className="mb-4 overflow-auto"
                style={{ maxHeight: '400px' }}
              >
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">
                        STT
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        MSSV
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Họ và tên
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Trạng thái
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {student.user.code}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {student.user.userName}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 text-center font-medium ${isStudentPresent(student.user.id) ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {isStudentPresent(student.user.id)
                            ? 'Có mặt'
                            : 'Vắng mặt'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            onClick={() => toggleAttendance(student.user.id)}
                            className={`rounded px-3 py-1 text-white ${isStudentPresent(student.user.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                            disabled={savingAttendance}
                          >
                            {isStudentPresent(student.user.id)
                              ? 'Đánh vắng'
                              : 'Điểm danh'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                  disabled={savingAttendance}
                >
                  Gửi thông báo lớp học
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                    disabled={savingAttendance}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveAll}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    disabled={savingAttendance}
                  >
                    {savingAttendance ? 'Đang lưu...' : 'Lưu điểm danh'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showNotificationModal && (
        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          classId={classId}
        />
      )}
    </>
  );
};

const AttendanceModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  lecture,
  onUpdate,
}) => {
  const { classId } = useParams<{ classId: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleUpdateLecture = async (updatedLecture: LectureProps) => {
    try {
      // This would be the actual API call to update the lecture
      console.log('Updating lecture', updatedLecture);
      alert('Đã cập nhật buổi học thành công!');
      // In a real implementation, you would refresh the lectures list here
      onUpdate && onUpdate(updatedLecture);
    } catch (error) {
      alert('Lỗi khi cập nhật buổi học!');
      console.error('Error updating lecture:', error);
    }
  };

  if (!isOpen) return null;

  const date = formatDate(lecture.startTime);
  const time = formatTime(lecture.startTime, lecture.endTime);
  const day = getDayOfWeek(lecture.startTime);
  const statusText = lecture.status === 1 ? 'Đã diễn ra' : 'Chưa diễn ra';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-1/2 rounded-lg bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold">Chi tiết buổi học</h2>
          <div className="space-y-2">
            <p>
              <strong>Ngày:</strong> {date} ({day})
            </p>
            <p>
              <strong>Tiêu đề:</strong> {lecture.title}
            </p>
            <p>
              <strong>Tài liệu:</strong> {lecture.file}
            </p>
            <p>
              <strong>Mô tả:</strong> {lecture.description}
            </p>
            <p>
              <strong>Thời gian:</strong> {time}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <span
                className={`font-medium ${
                  lecture.status === 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {statusText}
              </span>
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              Gửi thông báo lớp học
            </button>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              >
                Sửa buổi học
              </button>
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Điểm danh
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditLectureModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          lecture={lecture}
          onSave={handleUpdateLecture}
        />
      )}

      {showAttendanceModal && (
        <AttendanceManagementModal
          isOpen={showAttendanceModal}
          onClose={() => setShowAttendanceModal(false)}
          lectureId={lecture.id}
          classId={Number(classId)}
        />
      )}

      {showNotificationModal && (
        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          classId={Number(classId)}
        />
      )}
    </>
  );
};

const LectureItem: React.FC<
  LectureProps & { onUpdate?: (lecture: LectureProps) => void }
> = ({
  id,
  title,
  description,
  file,
  startTime,
  endTime,
  status,
  onUpdate,
}) => {
  const date = formatDate(startTime);
  const time = formatTime(startTime, endTime);
  const day = getDayOfWeek(startTime);

  const statusText = status === 1 ? 'Đã diễn ra' : 'Chưa diễn ra';
  const statusClass =
    status === 1 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800';

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="m-auto my-4 flex h-[100px] w-full cursor-pointer items-center rounded-2xl border border-gray-400 bg-gray-100 shadow-xl hover:bg-gray-200"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="my-auto ml-5 flex flex-col">
          <h1 className="my-auto text-xl font-semibold">
            {day}, ngày {date}
          </h1>
          <p className="my-auto text-sm font-normal">
            Tiêu đề:
            <p className="ml-1 inline text-sm font-medium text-red-500">
              {title}
            </p>
          </p>
          <div className="my-auto flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <p className="ml-2 inline text-sm">{file}</p>
          </div>
        </div>
        <p className="mx-auto">{description}</p>
        <div className="flex h-full flex-col">
          <div
            className={`my-auto mr-4 flex h-auto w-auto justify-start rounded-lg ${statusClass} p-2`}
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
            <p className="ml-2 inline text-sm">{time}</p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lecture={{ id, title, description, file, startTime, endTime, status }}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export const RollCallList: React.FC = () => {
  const { classId } = useParams();
  const [lectures, setLectures] = useState<LectureProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshLectures = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUpdateLecture = async (updatedLecture: LectureProps) => {
    try {
      // In a real implementation, this would be an API call to update the lecture
      // For now we'll simulate it by updating the local state
      console.log('Updating lecture', updatedLecture);

      // Simulating API call
      // await api.put(`/api/lectures/lectures/${updatedLecture.id}`, updatedLecture);

      // Update local state
      setLectures((prevLectures) =>
        prevLectures.map((lecture) =>
          lecture.id === updatedLecture.id ? updatedLecture : lecture
        )
      );

      alert('Đã cập nhật buổi học thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật buổi học!');
      console.error('Error updating lecture:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`/api/users/${userId}`);
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        // Fetch lectures
        const response = await api.get(
          `/api/lectures/lectures/class/${classId}`
        );
        setLectures(response.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch lecture data');
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, refreshTrigger]);

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Danh sách buổi học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={() => {}} />
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
        {lectures.length > 0 ? (
          lectures.map((lecture) => (
            <LectureItem
              key={lecture.id}
              id={lecture.id}
              title={lecture.title}
              description={lecture.description}
              file={lecture.file}
              startTime={lecture.startTime}
              endTime={lecture.endTime}
              status={lecture.status}
              onUpdate={handleUpdateLecture}
            />
          ))
        ) : (
          <div className="p-4 text-center">Không có buổi học nào</div>
        )}
      </div>
    </div>
  );
};
