import api from './api';

const commentService = {
  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },
  
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
  
  toggleVote: async (id) => {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  },
  
  checkUserVoted: async (id) => {
    const response = await api.get(`/comments/${id}/like`);
    return response.data;
  },
  
  markAsAccepted: async (id) => {
    const response = await api.post(`/comments/${id}/accept`);
    return response.data;
  }
};

export default commentService;