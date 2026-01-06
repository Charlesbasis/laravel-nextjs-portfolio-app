import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: true,
});

// Token management
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
const setToken = (token: string) => typeof window !== 'undefined' && localStorage.setItem('auth_token', token);
const removeToken = () => typeof window !== 'undefined' && localStorage.removeItem('auth_token');

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiRequest = async <T>(
  requestPromise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
  try {
    const response = await requestPromise;
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Use type narrowing for the error message
      const serverMessage = error.response?.data?.message || error.message;
      throw serverMessage || 'An error occurred';
    }
    throw 'An unexpected error occurred';
  }
};

export const apiClient = {
  // Auth
  login: (email: string, password: string) => 
    api.post<ApiResponse<{token: string, user: Record<string, unknown>}>>('/login', { email, password }).then(res => {
      if (res.data.data?.token) setToken(res.data.data.token);
      return res.data.data;
    }),
  
  register: (data: Record<string, unknown>) => 
    api.post<ApiResponse<{token: string, user: Record<string, unknown>}>>('/register', data).then(res => {
      if (res.data.data?.token) setToken(res.data.data.token);
      return res.data.data;
    }),
  
  logout: () => api.post<ApiResponse<null>>('/logout').then(() => removeToken()),
  
  getUser: <T = Record<string, unknown>>() => api.get<ApiResponse<T>>('/user').then(res => res.data.data),
  
  // Projects
  getProjects: <T = unknown[]>(params?: Record<string, unknown>) => 
    api.get<ApiResponse<T>>('/projects', { params }).then(res => res.data.data || (res.data as unknown as T)),

  getProject: <T = unknown>(slug: string) => 
    api.get<ApiResponse<T>>(`/projects/${slug}`).then(res => res.data.data || (res.data as unknown as T)),

  createProject: (formData: FormData) => 
    api.post<ApiResponse<Record<string, unknown>>>('/projects', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateProject: (id: number, formData: FormData) => 
    api.post<ApiResponse<Record<string, unknown>>>(`/projects/${id}`, formData, { 
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteProject: (id: number) => api.delete<ApiResponse<null>>(`/projects/${id}`),
  
  // Skills
  getSkills: <T = unknown[]>(params?: Record<string, unknown>) => 
    api.get<ApiResponse<T>>('/skills', { params }).then(res => res.data.data || (res.data as unknown as T)),
  
  createSkill: (data: Record<string, unknown>) => api.post<ApiResponse<Record<string, unknown>>>('/skills', data),
  
  updateSkill: (id: number, data: Record<string, unknown>) => api.put<ApiResponse<Record<string, unknown>>>(`/skills/${id}`, data),
  
  deleteSkill: (id: number) => api.delete<ApiResponse<null>>(`/skills/${id}`),
  
  // Profile
  getPublicProfile: <T = unknown>(username: string) => 
    api.get<ApiResponse<T>>(`/users/${username}/profile`).then(res => res.data.data || (res.data as unknown as T)),
    
  getCurrentProfile: <T = unknown>() => 
    api.get<ApiResponse<T>>('/profile').then(res => res.data.data || (res.data as unknown as T)),
    
  updateProfile: (data: Record<string, unknown>) => api.put<ApiResponse<Record<string, unknown>>>('/profile', data),

  getExperiences: <T = unknown[]>(username?: string) => 
    api.get<ApiResponse<T>>(username ? `/users/${username}/experiences` : '/experiences').then(res => res.data.data || (res.data as unknown as T)),
  
  checkUsername: (username: string) => 
    api.get<ApiResponse<{available: boolean}>>(`/onboarding/check-username/${username}`).then(res => res.data),
    
  completeOnboarding: (data: Record<string, unknown>) => 
    api.post<ApiResponse<Record<string, unknown>>>('/onboarding/complete', data).then(res => res.data),
    
  submitContact: (data: Record<string, unknown>) => 
    api.post<ApiResponse<null>>('/contact/submit', data).then(res => res.data),
};

export { getToken, setToken, removeToken };
export default api;
