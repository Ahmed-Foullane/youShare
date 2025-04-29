import api from './api';

const tagService = {
  getAllTags: async () => {
    try {
      const response = await api.get('/tags');
      if (response.data && response.data.data) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      if (response.data) return response.data;
      return [];
    } catch (error) {
      try {
        const adminResponse = await api.get('/admin-tags');
        
        if (adminResponse.data && adminResponse.data.data) return adminResponse.data.data;
        if (Array.isArray(adminResponse.data)) return adminResponse.data;
        if (adminResponse.data) return adminResponse.data;
        
        return [];
      } catch (adminError) {
        return [];
      }
    }
  },
  
  getTagById: async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },
  
  searchTags: async (query) => {
    const response = await api.get(`/tags/search?query=${query}`);
    return response.data;
  },
  
  createTag: async (name) => {
    const response = await api.post('/tags', { name });
    return response.data;
  },
  
  updateTag: async (id, name) => {
    const response = await api.put(`/tags/${id}`, { name });
    return response.data;
  },
  
  deleteTag: async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  }
};

export default tagService;