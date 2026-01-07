import axios, { AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, RegisterData, User, UsernameCheckResponse } from '../types';

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
  login: (email: string, password: string) => 
    api.post<AuthResponse>('/login', { email, password }).then(res => {
      if (res.data.data?.token) setToken(res.data.data.token);
      return res.data; // Return the full AuthResponse
    }),
  
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/register', data).then(res => {
      if (res.data.data?.token) setToken(res.data.data.token);
      return res.data; // Return the full AuthResponse
    }),
  
  logout: () => api.post<ApiResponse<null>>('/logout').then(() => removeToken()),
  
  // Use the User interface here
  getUser: () => api.get<ApiResponse<User>>('/user').then(res => res.data.data),
  
  checkUsername: (username: string) => 
    api.get<UsernameCheckResponse>(`/onboarding/check-username`, { 
      params: { username } 
    }).then(res => res.data),

  // Update completeOnboarding to use the OnboardingData type if preferred
  completeOnboarding: (data: any) => 
    api.post<ApiResponse<{ user: User, redirect_url: string }>>('/onboarding/complete', data)
      .then(res => res.data),
};

export { getToken, setToken, removeToken };
export default api;
