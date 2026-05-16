import { useState, useEffect } from 'react';
import { Profile } from '../../components/Profile';
import { SearchBox } from '../../components/Search_box';
import { Title } from '../../components/Title';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import axios from 'axios';
import * as XLSX from 'xlsx';

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

// Export Attendance Modal
interface ExportAttendanceModalProps {
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

interface FaceRecognitionUser {
  ten: string;
  user_id: number;
  lecture_id: number;
  time_checkin: string;
}

// New interface for lecture attendance summary
interface LectureAttendanceSummary {
  id: number;
  title: string;
  date: string;
  presentCount: number;
  absentCount: number;
  totalCount: number;
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

// Export Attendance Modal Component
const ExportAttendanceModal: React.FC<ExportAttendanceModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [lectures, setLectures] = useState<LectureProps[]>([]);
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: { [key: number]: number };
  }>({});
  const [attendanceSummary, setAttendanceSummary] = useState<
    LectureAttendanceSummary[]
  >([]);

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

        // Fetch lectures for this class
        const lectureResponse = await axios.get(
          `http://localhost:8080/api/lectures/lectures/class/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (lectureResponse.data) {
          setLectures(lectureResponse.data);

          // Initialize attendance summary
          const summary: LectureAttendanceSummary[] = lectureResponse.data.map(
            (lecture: LectureProps) => ({
              id: lecture.id,
              title: lecture.title,
              date: formatDate(lecture.startTime),
              presentCount: 0,
              absentCount: 0,
              totalCount: classStudents.length,
            })
          );

          setAttendanceSummary(summary);

          // Fetch attendance for each lecture
          const attendancePromises = lectureResponse.data.map(
            async (lecture: LectureProps) => {
              try {
                const attendanceResponse = await axios.get(
                  `http://localhost:8080/api/attendances/by-lecture/${lecture.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                return {
                  lectureId: lecture.id,
                  attendances: attendanceResponse.data || [],
                };
              } catch (err) {
                console.error(
                  `Error fetching attendance for lecture ${lecture.id}:`,
                  err
                );
                return { lectureId: lecture.id, attendances: [] };
              }
            }
          );

          const attendanceResults = await Promise.all(attendancePromises);

          // Process attendance data
          const attendanceMap: { [key: string]: { [key: number]: number } } =
            {};

          // Initialize attendance map for all students
          classStudents.forEach((student: Student) => {
            attendanceMap[student.user.id] = {};
            lectureResponse.data.forEach((lecture: LectureProps) => {
              attendanceMap[student.user.id][lecture.id] = 0; // Default to absent
            });
          });

          // Fill in attendance data
          attendanceResults.forEach((result) => {
            const { lectureId, attendances } = result;

            // Update summary for this lecture
            const summaryIndex = summary.findIndex((s) => s.id === lectureId);
            let presentCount = 0;

            attendances.forEach((attendance: Attendance) => {
              const userId = attendance.userId;
              const status = attendance.status;

              // Update attendance map
              if (attendanceMap[userId]) {
                attendanceMap[userId][lectureId] = status;

                // Count present students for summary
                if (status === 1) {
                  presentCount++;
                }
              }
            });

            if (summaryIndex >= 0) {
              summary[summaryIndex].presentCount = presentCount;
              summary[summaryIndex].absentCount =
                classStudents.length - presentCount;
            }
          });

          setAttendanceData(attendanceMap);
          setAttendanceSummary(summary);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu điểm danh: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, classId]);

  const exportToExcel = () => {
    try {
      // Create detailed attendance worksheet
      const detailedData: (string | number)[][] = [
        // Header row with lecture dates
        [
          'STT',
          'MSSV',
          'Họ và tên',
          ...lectures.map(
            (lecture) => `${formatDate(lecture.startTime)} (${lecture.title})`
          ),
        ],
      ];

      // Add student rows
      students.forEach((student: Student, index: number) => {
        const row: (string | number)[] = [
          index + 1,
          student.user.code,
          student.user.userName,
        ];

        // Add attendance status for each lecture
        lectures.forEach((lecture) => {
          const status = attendanceData[student.user.id]?.[lecture.id] || 0;
          row.push(status === 1 ? 'Có mặt' : 'Vắng mặt');
        });

        detailedData.push(row);
      });

      // Create summary worksheet
      const summaryData: (string | number)[][] = [
        [
          'STT',
          'Tiêu đề buổi học',
          'Ngày',
          'Số sinh viên có mặt',
          'Số sinh viên vắng mặt',
          'Tổng số',
        ],
      ];

      attendanceSummary.forEach((summary, index) => {
        summaryData.push([
          index + 1,
          summary.title,
          summary.date,
          summary.presentCount,
          summary.absentCount,
          summary.totalCount,
        ]);
      });

      // Create workbook with both worksheets
      const wb = XLSX.utils.book_new();

      const detailedWs = XLSX.utils.aoa_to_sheet(detailedData);
      XLSX.utils.book_append_sheet(wb, detailedWs, 'Chi tiết điểm danh');

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng kết điểm danh');

      // Generate file name with class ID and current date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Diem_danh_lop_${classId}_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      alert('Đã xuất dữ liệu điểm danh thành công!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/3 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Xuất dữ liệu điểm danh</h2>

        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <div className="mb-2 text-lg">Thông tin tổng quan:</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <p className="font-bold">Tổng số sinh viên:</p>
                  <p className="text-lg">{students.length}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3">
                  <p className="font-bold">Tổng số buổi học:</p>
                  <p className="text-lg">{lectures.length}</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3">
                  <p className="font-bold">Dữ liệu điểm danh:</p>
                  <p className="text-lg">
                    {lectures.length > 0
                      ? `${lectures.length} buổi`
                      : 'Chưa có dữ liệu'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 overflow-auto" style={{ maxHeight: '300px' }}>
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">
                      STT
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Tiêu đề buổi học
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Ngày
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Có mặt
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Vắng mặt
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Tỷ lệ tham gia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceSummary.map((summary, index) => (
                    <tr key={summary.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {summary.title}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {summary.date}
                      </td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">
                        {summary.presentCount}
                      </td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">
                        {summary.absentCount}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {summary.totalCount > 0
                          ? `${Math.round((summary.presentCount / summary.totalCount) * 100)}%`
                          : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                disabled={loading || lectures.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [faceRecognitionLoading, setFaceRecognitionLoading] = useState(false);

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
        // Update existing attendance record using the correct API endpoint
        await axios.put(
          `http://127.0.0.1:8080/api/attendances/status/${userId}?status=${newStatus}`,
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
          'http://127.0.0.1:8080/api/attendances/add',
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

  // Add face recognition attendance function
  const handleFaceRecognition = async () => {
    try {
      setFaceRecognitionLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // Call the face recognition API
      const response = await axios.post(
        'http://localhost:8000/face-checkin/',
        {
          lecture_id: lectureId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.checked_in_users) {
        const checkedInUsers = response.data
          .checked_in_users as FaceRecognitionUser[];

        // Update the attendance records in state
        const updatedAttendances = [...attendances];

        // Process each recognized user and mark them as present (only in UI)
        checkedInUsers.forEach((user: FaceRecognitionUser) => {
          const userId = user.user_id;
          const existingIndex = updatedAttendances.findIndex(
            (att) => att.userId === userId
          );

          // Update UI state
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

        // Show success message with count of recognized students
        alert(
          `Đã nhận diện khuôn mặt thành công cho ${checkedInUsers.length} sinh viên. Nhấn "Lưu điểm danh" để lưu vào cơ sở dữ liệu.`
        );
      }
    } catch (error: any) {
      console.error('Error during face recognition:', error);
      setError(
        'Lỗi khi thực hiện điểm danh bằng khuôn mặt: ' +
          (error.response?.data?.detail ||
            error.message ||
            'Không thể kết nối đến máy chủ nhận diện khuôn mặt')
      );
    } finally {
      setFaceRecognitionLoading(false);
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

      // Create a list of all students and their current attendance status
      const attendanceToSave = students.map((student) => {
        const userId = student.user.id;
        const isPresent = isStudentPresent(userId);
        return {
          userId,
          lectureId,
          status: isPresent ? 1 : 0,
        };
      });

      // Process all students in the class
      const savePromises = attendanceToSave.map(async (record) => {
        const attendanceId = getAttendanceId(record.userId);

        try {
          if (attendanceId) {
            // Update existing attendance record
            await axios.put(
              `http://localhost:8080/api/attendances/status/${attendanceId}?status=${record.status}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            // Create new attendance record
            await axios.post(
              'http://localhost:8080/api/attendances/add',
              {
                userId: record.userId,
                lectureId,
                status: record.status,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
          return true;
        } catch (error) {
          console.error(
            `Error saving attendance for user ${record.userId}:`,
            error
          );
          return false;
        }
      });

      const results = await Promise.all(savePromises);
      const successCount = results.filter((result) => result === true).length;

      alert(
        `Đã lưu điểm danh thành công cho ${successCount}/${students.length} sinh viên!`
      );
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
                    onClick={handleFaceRecognition}
                    className="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    disabled={faceRecognitionLoading || savingAttendance}
                  >
                    {faceRecognitionLoading ? (
                      <>
                        <svg
                          className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                        Đang nhận diện...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          ></path>
                        </svg>
                        Điểm danh bằng khuôn mặt
                      </>
                    )}
                  </button>
                  <button
                    onClick={markAllPresent}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    disabled={savingAttendance || faceRecognitionLoading}
                  >
                    Có mặt tất cả
                  </button>
                  <button
                    onClick={markAllAbsent}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    disabled={savingAttendance || faceRecognitionLoading}
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
                            disabled={
                              savingAttendance || faceRecognitionLoading
                            }
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                    disabled={savingAttendance || faceRecognitionLoading}
                  >
                    Gửi thông báo lớp học
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                    disabled={savingAttendance || faceRecognitionLoading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveAll}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    disabled={savingAttendance || faceRecognitionLoading}
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

      {showExportModal && (
        <ExportAttendanceModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
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
  const [showExportModal, setShowExportModal] = useState(false);

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
        <div className="flex items-center">
          <SearchBox onSearch={() => {}} />
        </div>
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
        <div className="flex justify-end">
          <button
            onClick={() => setShowExportModal(true)}
            className="ml-4 flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất báo cáo điểm danh
          </button>
        </div>
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

      {showExportModal && (
        <ExportAttendanceModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          classId={Number(classId)}
        />
      )}
    </div>
  );
};
