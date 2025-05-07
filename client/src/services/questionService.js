import api from './api';

const questionService = {
  getAllQuestions: async (page = 1, perPage = 10) => {
    const response = await api.get(`/questions?page=${page}&per_page=${perPage}`);
    return response.data;
  },
  
  getQuestionById: async (id) => {
    try {
      const response = await api.get(`/questions/${id}`);      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createQuestion: async (formData) => {
    try {
      if (formData instanceof FormData) {
        const response = await api.post('/questions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await api.post('/questions', formData);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
  
  updateQuestion: async (id, formData) => {
    try {
      if (formData instanceof FormData) {
        if (!formData.has('_method')) {
          formData.append('_method', 'PUT');
        }

        const response = await api.post(`/questions/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-HTTP-Method-Override': 'PUT'
          }
        });
        return response.data;
      } else {
        const dataToSend = { ...formData, _method: 'PUT' };
        const response = await api.post(`/questions/${id}`, dataToSend);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
  
  deleteQuestion: async (id) => {
    try {
      try {
        const response = await api.delete(`/questions/${id}`);
        return response.data;
      } catch (deleteError) {
        try {
          const formData = new FormData();
          formData.append('_method', 'DELETE');
          
          const response = await api.post(`/questions/${id}`, formData);
          return response.data;
        } catch (formError) {
          const response = await api.post(`/delete-question/${id}`);
          return response.data;
        }
      }
    } catch (error) {
      throw error;
    }
  },
  
  searchQuestions: async (query, page = 1, perPage = 10) => {
    const response = await api.get(`/questions/search?query=${query}&page=${page}&per_page=${perPage}`);
    return response.data;
  },
  
  getQuestionsByTag: async (tagId, page = 1, perPage = 10) => {
    const response = await api.get(`/questions/tag/${tagId}?page=${page}&per_page=${perPage}`);
    return response.data;
  },
  
  getQuestionsByUser: async (userId, page = 1, perPage = 10) => {
    const response = await api.get(`/questions/user/${userId}?page=${page}&per_page=${perPage}`);
    return response.data;
  },
  
  toggleVote: async (id) => {
    const response = await api.post(`/questions/${id}/like`);
    return response.data;
  },
  
  checkUserVoted: async (id) => {
    const response = await api.get(`/questions/${id}/like`);
    return response.data;
  },
  
  getComments: async (questionId) => {
    try {
      const response = await api.get(`/questions/${questionId}/comments`);
      return response.data;
    } catch (error) {
      return { data: [] };
    }
  },
  
  addComment: async (questionId, content) => {
    try {
      const response = await api.post(`/questions/${questionId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default questionService;