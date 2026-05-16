import api from '../api/axiosConfig';

export const classService = {
  // Lấy danh sách lớp học theo khóa học
  getClassesByCourse: async (courseId: number) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/classes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết lớp học
  getClassDetail: async (classId: number) => {
    try {
      const response = await api.get(`/api/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tiến trình học tập của sinh viên
  getLearningProgress: async (studentId: number) => {
    try {
      const response = await api.get(
        `/api/classes/learning-process?studentId=${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching learning progress for student ${studentId}:`,
        error
      );
      return {
        success: false,
        message: 'Failed to load learning progress data',
        data: [],
      };
    }
  },

  // Lấy thời khóa biểu của sinh viên
  getStudentSchedule: async (studentId: number) => {
    try {
      const response = await api.get(`/api/lectures/student/${studentId}`);
      if (response.data) {
        return response.data;
      } else {
        console.warn(`Empty response for student schedule ${studentId}`);
        return {
          success: true,
          message: 'No schedule data available',
          data: [],
        };
      }
    } catch (error) {
      console.error(`Error fetching schedule for student ${studentId}:`, error);
      // Return a more detailed error response
      return {
        success: false,
        message: 'Failed to load schedule data. The server may be unavailable.',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  },
};
