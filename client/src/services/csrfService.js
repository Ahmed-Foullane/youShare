import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const getCsrfToken = async () => {
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    return false;
  }
};