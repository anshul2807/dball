import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dball_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token if stored
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin') || currentPath.includes('/dashboard')) {
        localStorage.removeItem('dball_token');
        localStorage.removeItem('dball_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const eventAPI = {
  getUpcoming: () => api.get('/events/upcoming'),
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getRegistrations: (id) => api.get(`/events/${id}/registrations`),
};

export const registrationAPI = {
  register: (data) => api.post('/registrations', data),
  getMyRegistrations: () => api.get('/registrations/my'),
  cancel: (id) => api.delete(`/registrations/${id}`),
  getAll: (params) => api.get('/registrations', { params }),
  updateStatus: (id, status) => api.patch(`/registrations/${id}/status`, { status }),
};

export const statsAPI = {
  getPublic: () => api.get('/stats/public'),
  getAdmin: () => api.get('/stats/admin'),
};

export default api;
