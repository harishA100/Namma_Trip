import api from './axiosConfig';
import { ApiResponse, AuthResponse } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getMe: () =>
    api.get<ApiResponse<any>>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<string>>('/auth/forgot-password', { email }),
};
