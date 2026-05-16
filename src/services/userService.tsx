import api from '../api/axiosConfig';

export const userService = {
    getCurrentUser: async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await api.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllStudents: async () => {
        try {
            const response = await api.get('/api/users/students');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    searchUsers: async (keyword: string) => {
        try {
            const response = await api.get(`/api/users/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserGrades: async (userId: number | string) => {
        try {
            const response = await api.get(`/api/users/${userId}/grades`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};