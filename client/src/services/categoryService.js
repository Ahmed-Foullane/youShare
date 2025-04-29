import api from './api';

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return [];
    }
  },
  
  getCategoriesWithCount: async () => {
    try {
      const response = await api.get('/categories/with-count');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return [];
    }
  },
  
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  
  searchCategories: async (query) => {
    const response = await api.get(`/categories/search?query=${query}`);
    return response.data;
  },
  
  createCategory: async (name) => {
    const response = await api.post('/categories', { name });
    return response.data;
  },
  
  updateCategory: async (id, name) => {
    const response = await api.put(`/categories/${id}`, { name });
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;