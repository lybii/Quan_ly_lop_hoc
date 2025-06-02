import React, { useState, useEffect } from 'react';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { Profile } from '../components/Profile';
import axios from 'axios';

interface Course {
  id: number;
  courseName: string;
  description: string;
  courseCode: string;
  credits: number;
  status: number;
  classes: null;
}

interface ClassData {
  id: number;
  classCode: string;
  type: string;
  count: number;
  status: number;
  courseId: number;
  classUserId: number;
  studentIds: null;
}

interface Lecture {
  id: number;
  title: string;
  description: string;
  file: string;
  startTime: string;
  endTime: string;
  status: number;
  classId: number;
}

interface User {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  avatar: string;
  code: string;
  major: string;
  status: number;
  role: {
    id: number;
    name: string;
  };
}

export const Classroom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [isEditLectureModalOpen, setIsEditLectureModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classType, setClassType] = useState('lý thuyết');
  const [classCount, setClassCount] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // New course form states
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  const [courseStatus, setCourseStatus] = useState(1);

  // Add this after existing state declarations
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Lecture form states
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDescription, setLectureDescription] = useState('');
  const [lectureFile, setLectureFile] = useState('');
  const [lectureFileObj, setLectureFileObj] = useState<File | null>(null);
  const [lectureStartTime, setLectureStartTime] = useState('');
  const [lectureEndTime, setLectureEndTime] = useState('');
  const [lectureStatus, setLectureStatus] = useState(1);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // Configure axios with auth headers
  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Set default authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Add this new useEffect to fetch current user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to get role name in Vietnamese
  const getRoleDisplayName = (roleName: string): string => {
    switch (roleName) {
      case 'ROLE_ADMIN':
        return 'Quản trị viên';
      case 'ROLE_STUDENT':
        return 'Sinh viên';
      case 'ROLE_LECTURER':
        return 'Giảng viên';
      default:
        return roleName;
    }
  };

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage for this specific request
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:8080/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (error: any) {
        console.error('Error fetching courses:', error);
        if (error.response && error.response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch teachers and students for class assignment
  const fetchUsersForClassAssignment = async () => {
    try {
      setIsLoadingUsers(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found');
        return;
      }

      // Fetch lecturers with the correct endpoint
      const teachersResponse = await axios.get(
        'http://localhost:8080/api/users/lecturers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (teachersResponse.data.success) {
        setTeachers(teachersResponse.data.data);
      } else {
        console.error('Failed to fetch lecturers:', teachersResponse.data);
      }

      // Fetch students with the correct endpoint
      const studentsResponse = await axios.get(
        'http://localhost:8080/api/users/students',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (studentsResponse.data.success) {
        setStudents(studentsResponse.data.data);
      } else {
        console.error('Failed to fetch students:', studentsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching users for class assignment:', error);
      setError(
        'Không thể tải danh sách giảng viên và sinh viên. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch classes for a selected course
  const fetchClassesForCourse = async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage for this specific request
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:8080/api/courses/${courseId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      if (error.response && error.response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(
          `Không thể tải danh sách lớp học cho khóa học ID: ${courseId}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch lectures for a selected class
  const fetchLecturesForClass = async (classId: number) => {
    try {
      setLecturesLoading(true);
      setError(null);

      // Get token from localStorage for this specific request
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:8080/api/lectures/lectures/class/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setLectures(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching lectures:', error);
      if (error.response && error.response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(`Không thể tải danh sách buổi học cho lớp ID: ${classId}`);
      }
    } finally {
      setLecturesLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedClass(null);
    setLectures([]);
    fetchClassesForCourse(course.id);
  };

  const handleClassSelect = (classData: ClassData) => {
    setSelectedClass(classData);
    fetchLecturesForClass(classData.id);
  };

  const handleOpenAddClassModal = () => {
    // Fetch users when opening the modal
    fetchUsersForClassAssignment();
    setIsModalOpen(true);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      setError('Vui lòng chọn một khóa học trước khi thêm lớp học.');
      return;
    }

    if (!selectedTeacher) {
      setError('Vui lòng chọn giảng viên cho lớp học.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newClass = {
        classCode: className,
        type: classType,
        count: parseInt(classCount),
        status: 1, // Active by default
        courseId: selectedCourse.id,
        classUserId: selectedTeacher,
        studentIds: selectedStudents.length > 0 ? selectedStudents : [],
      };

      console.log('Sending class data:', newClass);

      const response = await axios.post(
        'http://localhost:8080/api/classes',
        newClass,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API response:', response.data);

      if (response.data.success) {
        // Refresh classes list
        fetchClassesForCourse(selectedCourse.id);

        // Reset form fields
        setClassName('');
        setClassType('lý thuyết');
        setClassCount('');
        setSelectedTeacher(null);
        setSelectedStudents([]);

        // Show success message
        setSuccessMessage('Lớp học đã được tạo thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể thêm lớp học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error adding class:', error);
      let errorMsg = 'Không thể thêm lớp học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter classes based on selected filter
  const filteredClasses = classes.filter((cls) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return cls.status === 1;
    if (selectedFilter === 'completed') return cls.status === 0;
    return true;
  });

  // Handle retry
  const handleRetry = () => {
    // Re-fetch courses
    setError(null);
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:8080/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses on retry:', error);
        setError(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Add this new function for handling course creation
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newCourse = {
        courseName,
        description: courseDescription,
        courseCode,
        credits: parseInt(courseCredits),
        status: courseStatus,
      };

      const response = await axios.post(
        'http://localhost:8080/api/courses',
        newCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Refresh courses list
        const coursesResponse = await axios.get(
          'http://localhost:8080/api/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.data);
        }

        // Reset form fields
        setCourseName('');
        setCourseDescription('');
        setCourseCode('');
        setCourseCredits('');
        setCourseStatus(1);

        // Show success message
        setSuccessMessage('Khóa học đã được tạo thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsAddCourseModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể thêm khóa học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error adding course:', error);
      let errorMsg = 'Không thể thêm khóa học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Add these new functions for handling course update and delete
  const handleEditCourse = (course: Course) => {
    setCourseName(course.courseName);
    setCourseDescription(course.description);
    setCourseCode(course.courseCode);
    setCourseCredits(course.credits.toString());
    setCourseStatus(course.status);
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      setError('Không tìm thấy khóa học để cập nhật.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedCourse = {
        courseName,
        description: courseDescription,
        courseCode,
        credits: parseInt(courseCredits),
        status: courseStatus,
      };

      const response = await axios.put(
        `http://localhost:8080/api/courses/${selectedCourse.id}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Refresh courses list
        const coursesResponse = await axios.get(
          'http://localhost:8080/api/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.data);

          // If the updated course was selected, update it
          if (selectedCourse) {
            const updatedCourseData = coursesResponse.data.data.find(
              (c: Course) => c.id === selectedCourse.id
            );
            if (updatedCourseData) {
              setSelectedCourse(updatedCourseData);
            }
          }
        }

        // Reset form fields
        setCourseName('');
        setCourseDescription('');
        setCourseCode('');
        setCourseCredits('');
        setCourseStatus(1);

        // Show success message
        setSuccessMessage('Khóa học đã được cập nhật thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsEditCourseModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể cập nhật khóa học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error updating course:', error);
      let errorMsg = 'Không thể cập nhật khóa học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `http://localhost:8080/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh courses list
        const coursesResponse = await axios.get(
          'http://localhost:8080/api/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.data.success) {
          setCourses(coursesResponse.data.data);
        }

        // If the deleted course was selected, clear selection
        if (selectedCourse && selectedCourse.id === courseId) {
          setSelectedCourse(null);
          setClasses([]);
        }

        // Show success message
        setSuccessMessage('Khóa học đã được xóa thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            'Không thể xóa khóa học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error deleting course:', error);
      let errorMsg = 'Không thể xóa khóa học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Add these new functions for handling class update and delete
  const handleEditClass = (classData: ClassData) => {
    setClassName(classData.classCode);
    setClassType(classData.type);
    setClassCount(classData.count.toString());
    setSelectedTeacher(classData.classUserId);
    setSelectedClass(classData);

    // Fetch users for class assignment if not already loaded
    if (teachers.length === 0) {
      fetchUsersForClassAssignment();
    }

    setIsEditClassModalOpen(true);
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass || !selectedCourse) {
      setError('Không tìm thấy lớp học để cập nhật.');
      return;
    }

    if (!selectedTeacher) {
      setError('Vui lòng chọn giảng viên cho lớp học.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedClass = {
        classCode: className,
        type: classType,
        count: parseInt(classCount),
        status: selectedClass.status,
        courseId: selectedCourse.id,
        classUserId: selectedTeacher,
      };

      const response = await axios.put(
        `http://localhost:8080/api/classes/${selectedClass.id}`,
        updatedClass,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Refresh classes list
        fetchClassesForCourse(selectedCourse.id);

        // Reset form fields
        setClassName('');
        setClassType('lý thuyết');
        setClassCount('');
        setSelectedTeacher(null);
        setSelectedClass(null);

        // Show success message
        setSuccessMessage('Lớp học đã được cập nhật thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsEditClassModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể cập nhật lớp học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error updating class:', error);
      let errorMsg = 'Không thể cập nhật lớp học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lớp học này không?')) {
      return;
    }

    if (!selectedCourse) {
      setError('Không tìm thấy khóa học cho lớp này.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `http://localhost:8080/api/classes/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh classes list
        fetchClassesForCourse(selectedCourse.id);

        // Show success message
        setSuccessMessage('Lớp học đã được xóa thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            'Không thể xóa lớp học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error deleting class:', error);
      let errorMsg = 'Không thể xóa lớp học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Add this new function for handling lecture creation with file upload
  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) {
      setError('Vui lòng chọn một lớp học trước khi thêm buổi học.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format dates to ISO string
      const startTimeISO = new Date(lectureStartTime).toISOString();
      const endTimeISO = new Date(lectureEndTime).toISOString();

      // Handle file upload if file is selected
      let filePath = lectureFile;
      if (lectureFileObj) {
        const formData = new FormData();
        formData.append('file', lectureFileObj);

        const fileUploadResponse = await axios.post(
          'http://localhost:8080/api/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (fileUploadResponse.data && fileUploadResponse.data.filePath) {
          filePath = fileUploadResponse.data.filePath;
        } else {
          setError('Không thể tải lên tệp. Vui lòng thử lại sau.');
          setLoading(false);
          return;
        }
      }

      const newLecture = {
        title: lectureTitle,
        description: lectureDescription,
        file: filePath,
        startTime: startTimeISO,
        endTime: endTimeISO,
        status: lectureStatus,
        classId: selectedClass.id,
      };

      const response = await axios.post(
        'http://localhost:8080/api/lectures/add',
        newLecture,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // Refresh lectures list
        fetchLecturesForClass(selectedClass.id);

        // Reset form fields
        setLectureTitle('');
        setLectureDescription('');
        setLectureFile('');
        setLectureFileObj(null);
        setLectureStartTime('');
        setLectureEndTime('');
        setLectureStatus(1);

        // Show success message
        setSuccessMessage('Buổi học đã được tạo thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsAddLectureModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể thêm buổi học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error adding lecture:', error);
      let errorMsg = 'Không thể thêm buổi học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLectureFileObj(file);
      setLectureFile(file.name);
    }
  };

  // Handle edit lecture
  const handleEditLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setLectureTitle(lecture.title);
    setLectureDescription(lecture.description);
    setLectureFile(lecture.file || '');
    setLectureFileObj(null);

    // Format dates for datetime-local input
    const startDate = new Date(lecture.startTime);
    const endDate = new Date(lecture.endTime);

    setLectureStartTime(formatDateForInput(startDate));
    setLectureEndTime(formatDateForInput(endDate));
    setLectureStatus(lecture.status);

    setIsEditLectureModalOpen(true);
  };

  // Handle update lecture
  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass || !selectedLecture) {
      setError('Không tìm thấy buổi học để cập nhật.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format dates to ISO string
      const startTimeISO = new Date(lectureStartTime).toISOString();
      const endTimeISO = new Date(lectureEndTime).toISOString();

      // Handle file upload if new file is selected
      let filePath = lectureFile;
      if (lectureFileObj) {
        const formData = new FormData();
        formData.append('file', lectureFileObj);

        const fileUploadResponse = await axios.post(
          'http://localhost:8080/api/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (fileUploadResponse.data && fileUploadResponse.data.filePath) {
          filePath = fileUploadResponse.data.filePath;
        } else {
          setError('Không thể tải lên tệp. Vui lòng thử lại sau.');
          setLoading(false);
          return;
        }
      }

      const updatedLecture = {
        title: lectureTitle,
        description: lectureDescription,
        file: filePath,
        startTime: startTimeISO,
        endTime: endTimeISO,
        status: lectureStatus,
        classId: selectedClass.id,
      };

      const response = await axios.put(
        `http://localhost:8080/api/lectures/update/${selectedLecture.id}`,
        updatedLecture,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // Refresh lectures list
        fetchLecturesForClass(selectedClass.id);

        // Reset form fields
        setLectureTitle('');
        setLectureDescription('');
        setLectureFile('');
        setLectureFileObj(null);
        setLectureStartTime('');
        setLectureEndTime('');
        setLectureStatus(1);
        setSelectedLecture(null);

        // Show success message
        setSuccessMessage('Buổi học đã được cập nhật thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setIsEditLectureModalOpen(false);
      } else {
        setError(
          response.data.message ||
            'Không thể cập nhật buổi học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error updating lecture:', error);
      let errorMsg = 'Không thể cập nhật buổi học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete lecture
  const handleDeleteLecture = async (lectureId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa buổi học này không?')) {
      return;
    }

    if (!selectedClass) {
      setError('Không tìm thấy lớp học cho buổi học này.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `http://localhost:8080/api/lectures/delete/${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Refresh lectures list
        fetchLecturesForClass(selectedClass.id);

        // Show success message
        setSuccessMessage('Buổi học đã được xóa thành công!');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            'Không thể xóa buổi học. Vui lòng thử lại sau.'
        );
      }
    } catch (error: any) {
      console.error('Error deleting lecture:', error);
      let errorMsg = 'Không thể xóa buổi học. Vui lòng thử lại sau.';

      if (error.response) {
        console.error('Response error data:', error.response.data);
        if (error.response.status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Format date for datetime-local input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Initialize default lecture times when opening the modal
  const handleOpenAddLectureModal = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setLectureStartTime(formatDateForInput(now));
    setLectureEndTime(formatDateForInput(oneHourLater));

    setIsAddLectureModalOpen(true);
  };

  return (
    <div className="no-scrollbar flex w-full flex-col overflow-auto scroll-smooth p-4">
      <Title title="Quản lý lớp học" />
      <div className="-mt-8 flex justify-between">
        <SearchBox onSearch={handleSearch} />
        <div className="flex items-center gap-4">
          {userProfile ? (
            <Profile
              name={userProfile.userName}
              role={getRoleDisplayName(userProfile.role.name)}
              image={userProfile.avatar || '../../src/assets/avatar.png'}
            />
          ) : (
            <Profile
              name="Loading..."
              role="Admin"
              image="../../src/assets/avatar.png"
            />
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Thêm lớp học mới</h2>
            <form onSubmit={handleAddClass}>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã lớp học
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mã lớp học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Loại lớp học
                  </label>
                  <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value="lý thuyết">Lý thuyết</option>
                    <option value="thực hành">Thực hành</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số lượng sinh viên
                  </label>
                  <input
                    type="number"
                    value={classCount}
                    onChange={(e) => setClassCount(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Số lượng sinh viên"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Giảng viên phụ trách
                  </label>
                  {isLoadingUsers ? (
                    <p className="mt-2 text-sm text-gray-500">
                      Đang tải danh sách giảng viên...
                    </p>
                  ) : (
                    <select
                      value={selectedTeacher || ''}
                      onChange={(e) =>
                        setSelectedTeacher(parseInt(e.target.value))
                      }
                      className="w-full rounded-lg border p-2"
                      required
                    >
                      <option value="">-- Chọn giảng viên --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.userName} - {teacher.code}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Sinh viên trong lớp
                </label>
                {isLoadingUsers ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Đang tải danh sách sinh viên...
                  </p>
                ) : (
                  <>
                    <div className="mt-2 max-h-[200px] overflow-y-auto rounded-lg border p-2">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="mb-2 flex items-center"
                          >
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={selectedStudents.includes(student.id)}
                              onChange={() =>
                                handleStudentSelection(student.id)
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`student-${student.id}`}
                              className="text-sm"
                            >
                              {student.userName} - {student.code}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="py-2 text-sm text-gray-500">
                          Không có sinh viên nào
                        </p>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Đã chọn {selectedStudents.length} sinh viên
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading || isLoadingUsers}
                >
                  {loading ? 'Đang xử lý...' : 'Thêm lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Thêm khóa học mới</h2>
            <form onSubmit={handleAddCourse}>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tên khóa học
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập tên khóa học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã khóa học
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mã khóa học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mô tả
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mô tả khóa học"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số tín chỉ
                  </label>
                  <input
                    type="number"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập số tín chỉ"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(parseInt(e.target.value))}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Thêm khóa học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditCourseModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Cập nhật khóa học</h2>
            <form onSubmit={handleUpdateCourse}>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tên khóa học
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập tên khóa học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã khóa học
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mã khóa học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mô tả
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mô tả khóa học"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số tín chỉ
                  </label>
                  <input
                    type="number"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập số tín chỉ"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(parseInt(e.target.value))}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditCourseModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Cập nhật khóa học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {isEditClassModalOpen && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Cập nhật lớp học</h2>
            <form onSubmit={handleUpdateClass}>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mã lớp học
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mã lớp học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Loại lớp học
                  </label>
                  <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value="lý thuyết">Lý thuyết</option>
                    <option value="thực hành">Thực hành</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số lượng sinh viên
                  </label>
                  <input
                    type="number"
                    value={classCount}
                    onChange={(e) => setClassCount(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Số lượng sinh viên"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Giảng viên phụ trách
                  </label>
                  {isLoadingUsers ? (
                    <p className="mt-2 text-sm text-gray-500">
                      Đang tải danh sách giảng viên...
                    </p>
                  ) : (
                    <select
                      value={selectedTeacher || ''}
                      onChange={(e) =>
                        setSelectedTeacher(parseInt(e.target.value))
                      }
                      className="w-full rounded-lg border p-2"
                      required
                    >
                      <option value="">-- Chọn giảng viên --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.userName} - {teacher.code}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditClassModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading || isLoadingUsers}
                >
                  {loading ? 'Đang xử lý...' : 'Cập nhật lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lecture Modal */}
      {isAddLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Thêm buổi học mới</h2>
            <form onSubmit={handleAddLecture}>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tiêu đề buổi học
                  </label>
                  <input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập tiêu đề buổi học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mô tả
                  </label>
                  <textarea
                    value={lectureDescription}
                    onChange={(e) => setLectureDescription(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mô tả buổi học"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tài liệu
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border p-2"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  />
                  {lectureFile && (
                    <p className="mt-1 text-sm text-gray-500">
                      File hiện tại: {lectureFile}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      value={lectureStartTime}
                      onChange={(e) => setLectureStartTime(e.target.value)}
                      className="w-full rounded-lg border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Thời gian kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      value={lectureEndTime}
                      onChange={(e) => setLectureEndTime(e.target.value)}
                      className="w-full rounded-lg border p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={lectureStatus}
                    onChange={(e) => setLectureStatus(parseInt(e.target.value))}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLectureModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Thêm buổi học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {isEditLectureModalOpen && selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold">Cập nhật buổi học</h2>
            <form onSubmit={handleUpdateLecture}>
              <div className="mb-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tiêu đề buổi học
                  </label>
                  <input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập tiêu đề buổi học"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Mô tả
                  </label>
                  <textarea
                    value={lectureDescription}
                    onChange={(e) => setLectureDescription(e.target.value)}
                    className="w-full rounded-lg border p-2"
                    placeholder="Nhập mô tả buổi học"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tài liệu
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border p-2"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  />
                  {lectureFile && (
                    <p className="mt-1 text-sm text-gray-500">
                      File hiện tại: {lectureFile}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      value={lectureStartTime}
                      onChange={(e) => setLectureStartTime(e.target.value)}
                      className="w-full rounded-lg border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Thời gian kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      value={lectureEndTime}
                      onChange={(e) => setLectureEndTime(e.target.value)}
                      className="w-full rounded-lg border p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Trạng thái
                  </label>
                  <select
                    value={lectureStatus}
                    onChange={(e) => setLectureStatus(parseInt(e.target.value))}
                    className="w-full rounded-lg border p-2"
                    required
                  >
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditLectureModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Cập nhật buổi học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p>{error}</p>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleRetry}
              className="rounded-lg bg-red-200 px-3 py-1 text-red-800 hover:bg-red-300"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Course List and Classes */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Course List */}
        <div className="col-span-1 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Danh sách khóa học</h2>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              + Thêm khóa học
            </button>
          </div>

          {loading && <p className="py-4 text-center">Đang tải...</p>}

          <div className="max-h-[600px] space-y-2 overflow-y-auto">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  selectedCourse?.id === course.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-3/4"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="font-medium">{course.courseName}</div>
                    <div className="text-sm">{course.courseCode}</div>
                    <div className="mt-1 flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          course.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {course.status === 1 ? 'Đang hoạt động' : 'Đã kết thúc'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCourse(course);
                      }}
                      className="rounded-lg bg-blue-100 px-2 py-1 text-blue-600 hover:bg-blue-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                      className="rounded-lg bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && !loading && !error && (
              <p className="py-4 text-center text-gray-500">
                Không tìm thấy khóa học
              </p>
            )}
          </div>
        </div>

        {/* Classes List */}
        <div className="col-span-3 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {selectedCourse
                ? `Lớp học: ${selectedCourse.courseName} (${selectedCourse.courseCode})`
                : 'Chọn một khóa học để xem lớp học'}
            </h2>

            {selectedCourse && (
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`rounded-lg px-3 py-1 ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedFilter('active')}
                    className={`rounded-lg px-3 py-1 ${selectedFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Đang hoạt động
                  </button>
                  <button
                    onClick={() => setSelectedFilter('completed')}
                    className={`rounded-lg px-3 py-1 ${selectedFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Đã hoàn thành
                  </button>
                </div>
                <button
                  onClick={handleOpenAddClassModal}
                  className="rounded-lg bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                >
                  + Thêm lớp
                </button>
              </div>
            )}
          </div>

          {loading && <p className="py-4 text-center">Đang tải...</p>}

          {selectedCourse ? (
            filteredClasses.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`cursor-pointer rounded-lg border p-4 shadow-sm ${
                        selectedClass?.id === cls.id
                          ? 'border-2 border-blue-500'
                          : ''
                      }`}
                      onClick={() => handleClassSelect(cls)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-bold">{cls.classCode}</h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            cls.status === 1
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cls.status === 1 ? 'Đang hoạt động' : 'Đã kết thúc'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Loại lớp:</span>
                          <span className="font-medium capitalize">
                            {cls.type}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span>Số sinh viên:</span>
                          <span className="font-medium">{cls.count}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span>Mã giảng viên:</span>
                          <span className="font-medium">{cls.classUserId}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClass(cls);
                          }}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-blue-600 hover:bg-blue-200"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(cls.id);
                          }}
                          className="rounded-lg bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lectures Section */}
                {selectedClass && (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Danh sách buổi học - {selectedClass.classCode}
                      </h3>
                      <button
                        onClick={handleOpenAddLectureModal}
                        className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      >
                        + Thêm buổi học
                      </button>
                    </div>

                    {lecturesLoading ? (
                      <p className="py-4 text-center">
                        Đang tải danh sách buổi học...
                      </p>
                    ) : lectures.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2 text-left">
                                Tiêu đề
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Mô tả
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Tài liệu
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Bắt đầu
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Kết thúc
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Trạng thái
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {lectures.map((lecture) => (
                              <tr key={lecture.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">
                                  {lecture.title}
                                </td>
                                <td className="border px-4 py-2">
                                  {lecture.description}
                                </td>
                                <td className="border px-4 py-2">
                                  {lecture.file ? (
                                    <a
                                      href={`http://localhost:8080/api/download/${lecture.file}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      Tải xuống
                                    </a>
                                  ) : (
                                    'Không có tài liệu'
                                  )}
                                </td>
                                <td className="border px-4 py-2">
                                  {formatDateTime(lecture.startTime)}
                                </td>
                                <td className="border px-4 py-2">
                                  {formatDateTime(lecture.endTime)}
                                </td>
                                <td className="border px-4 py-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                      lecture.status === 1
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {lecture.status === 1
                                      ? 'Đang hoạt động'
                                      : 'Đã kết thúc'}
                                  </span>
                                </td>
                                <td className="border px-4 py-2">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => handleEditLecture(lecture)}
                                      className="rounded-lg bg-blue-100 px-3 py-1 text-blue-600 hover:bg-blue-200"
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteLecture(lecture.id)
                                      }
                                      className="rounded-lg bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200"
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="py-4 text-center text-gray-500">
                        Không có buổi học nào cho lớp này
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">
                Không có lớp học nào
              </p>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mb-4 h-16 w-16 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <p className="text-gray-500">
                Vui lòng chọn một khóa học từ danh sách bên trái
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
