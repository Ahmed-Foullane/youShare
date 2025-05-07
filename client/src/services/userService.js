import api from './api';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/public-users');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;