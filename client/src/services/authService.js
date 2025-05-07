import api from './api';

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      const userData = response.data;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      return authService.getUser();
    }
  },
  
  updateProfile: async (userData) => {
    const response = await api.post('/update-profile', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  updateProfileImage: async (formData) => {
    const response = await api.post('/update-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAdmin: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return false;
      
      const parsedUser = JSON.parse(user);
      return parsedUser.role && parsedUser.role.name === 'admin';
    } catch (error) {
      return false;
    }
  },
};

export default authService;