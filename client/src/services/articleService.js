import api from './api';

const articleService = {
  getAllArticles: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/articles?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticleById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createArticle: async (formData) => {
    try {
      const response = await api.post('/articles', formData, {
        headers: {
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateArticle: async (id, formData) => {
    try {
      if (formData instanceof FormData) {
        if (!formData.has('_method')) {
          formData.append('_method', 'PUT');
        }

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };

        const response = await api.post(`/articles/${id}`, formData, config);
        return response.data;
      } else {
        const response = await api.put(`/articles/${id}`, formData);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
  
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  searchArticles: async (query, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/articles/search?query=${query}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticlesByCategory: async (categoryId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/articles/category/${categoryId}?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticlesByTag: async (tagId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/articles/tag/${tagId}?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticlesByUser: async (userId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/articles/user/${userId}?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMostLikedArticles: async (limit = 5) => {
    try {
      const response = await api.get(`/articles/most-liked?limit=${limit}`);
      return response.data;
    } catch (error) {
      return { data: [] };
    }
  },
  
  toggleLike: async (id) => {
    try {
      const response = await api.post(`/articles/${id}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  checkUserLiked: async (id) => {
    try {
      const response = await api.get(`/articles/${id}/like`);
      return response.data;
    } catch (error) {
      return { liked: false };
    }
  }
};

export default articleService;