import api from './axiosConfig';

export const postApi = {
  getFeed: (page = 0, size = 10) =>
    api.get(`/posts?page=${page}&size=${size}`),
  create: (data: { caption: string; destinationId?: number; images?: string }) =>
    api.post('/posts', data),
  toggleLike: (postId: number) =>
    api.post(`/posts/${postId}/like`),
  addComment: (postId: number, content: string) =>
    api.post(`/posts/${postId}/comment`, { content }),
  getComments: (postId: number) =>
    api.get(`/posts/${postId}/comments`),
};

export const tripApi = {
  generate: (data: { destination: string; budget: number; duration: number; companions?: string; interests?: string }) =>
    api.post('/trips/generate', data),
  getUserTrips: () =>
    api.get('/trips'),
  getById: (id: number) =>
    api.get(`/trips/${id}`),
  updateStatus: (id: number, status: string) =>
    api.put(`/trips/${id}/status`, { status }),
};

export const expenseApi = {
  getByTrip: (tripId: number) =>
    api.get(`/expenses?tripId=${tripId}`),
  add: (data: { tripId: number; category: string; amount: number; description?: string; expenseDate?: string }) =>
    api.post('/expenses', data),
  update: (id: number, data: any) =>
    api.put(`/expenses/${id}`, data),
  delete: (id: number) =>
    api.delete(`/expenses/${id}`),
  getSummary: (tripId: number) =>
    api.get(`/expenses/summary?tripId=${tripId}`),
};

export const destinationApi = {
  getAll: (page = 0, size = 12, category?: string) =>
    api.get(`/destinations${category ? `?category=${category}&` : '?'}page=${page}&size=${size}`),
  search: (query: string, page = 0) =>
    api.get(`/destinations/search?q=${query}&page=${page}`),
  getById: (id: number) =>
    api.get(`/destinations/${id}`),
  getTrending: () =>
    api.get('/destinations/trending'),
  toggleSave: (id: number) =>
    api.post(`/destinations/${id}/save`),
  getSaved: () =>
    api.get('/destinations/saved'),
};

export const checklistApi = {
  getByTrip: (tripId: number) =>
    api.get(`/checklists?tripId=${tripId}`),
  generate: (tripId: number) =>
    api.post('/checklists/generate', { tripId }),
  toggle: (id: number) =>
    api.put(`/checklists/${id}`),
};

export const notificationApi = {
  getAll: () =>
    api.get('/notifications'),
  markRead: (id: number) =>
    api.put(`/notifications/${id}/read`),
  getUnreadCount: () =>
    api.get('/notifications/unread-count'),
};

export const partnerApi = {
  createRequest: (data: { destination: string; travelDate?: string; interests?: string; travelStyle?: string }) =>
    api.post('/partners/request', data),
  getMatches: () =>
    api.get('/partners/matches'),
};

export const experienceApi = {
  getAll: (page = 0, size = 10) =>
    api.get(`/experiences?page=${page}&size=${size}`),
  create: (data: { destination: string; title: string; description?: string; rating?: number; images?: string }) =>
    api.post('/experiences', data),
  update: (id: number, data: any) =>
    api.put(`/experiences/${id}`, data),
  delete: (id: number) =>
    api.delete(`/experiences/${id}`),
};

export const userApi = {
  getById: (id: number) =>
    api.get(`/users/${id}`),
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put('/users/profile', data),
  getStats: () =>
    api.get('/users/stats'),
};

export const adminApi = {
  getUsers: (page = 0, size = 20) =>
    api.get(`/admin/users?page=${page}&size=${size}`),
  updateRole: (id: number, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
  addDestination: (data: any) =>
    api.post('/admin/destinations', data),
  updateDestination: (id: number, data: any) =>
    api.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id: number) =>
    api.delete(`/admin/destinations/${id}`),
  deletePost: (id: number) =>
    api.delete(`/admin/posts/${id}`),
  getAnalytics: () =>
    api.get('/admin/analytics'),
};
