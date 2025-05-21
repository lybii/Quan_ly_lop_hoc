import api from '../api/axiosConfig';

export const courseService = {
    // Lấy tất cả khóa học
    getAllCourses: async () => {
        try {
            const response = await api.get('/api/courses');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết khóa học
    getCourse: async (courseId: number) => {
        try {
            const response = await api.get(`/api/courses/${courseId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy khóa học của giảng viên
    getTeacherCourses: async (teacherId: number) => {
        try {
            const response = await api.get(`/api/courses/teacher/${teacherId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tìm kiếm khóa học
    searchCourses: async (keyword: string) => {
        try {
            const response = await api.get(`/api/courses/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 