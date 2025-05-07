import api from './api';

const adminService = {
  getStatistics: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  getAllArticles: async () => {
    const response = await api.get('/all-articles');
    return response.data;
  },
  
  deleteArticle: async (id) => {
    const response = await api.delete(`/all-articles/${id}`);
    return response.data;
  },
  
  getAllQuestions: async () => {
    const response = await api.get('/all-questions');
    return response.data;
  },
  
  deleteQuestion: async (id) => {
    const response = await api.delete(`/all-questions/${id}`);
    return response.data;
  },
  
  getAllComments: async () => {
    const response = await api.get('/comments');
    return response.data;
  },
  
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

export default adminService;