import api, { handleApiRequest } from '../lib/api';
import { extractData, extractNestedData } from '../lib/utils';
import {
  ApiResponse,
  ContactFormData,
  LoginCredentials,
  OnboardingCompleteResponse,
  OnboardingData,
  OnboardingStatusResponse,
  Project,
  RegisterData,
  Service,
  Skill,
  Testimonial,
  User,
  UsernameCheckResponse
} from '../types';

// ============= Projects Service =============
export const projectsService = {
  getAll: async (params?: { 
    featured?: boolean; 
    per_page?: number;
    page?: number;
    technology?: string;
  }): Promise<Project[]> => {
    // Note: handleApiRequest refactored to take only the promise
    const response = await handleApiRequest<ApiResponse<Project[]>>(
      api.get('/projects', { params })
    );
    
    const extracted = extractData<Project[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getBySlug: async (slug: string): Promise<Project | null> => {
    const response = await handleApiRequest<ApiResponse<Project>>(
      api.get(`/projects/${slug}`)
    );
    
    if (!response) return null;
    const extracted = extractData<Project>(response);
    return extracted || null;
  },

  getFeatured: async (limit: number = 3): Promise<Project[]> => {
    return projectsService.getAll({ featured: true, per_page: limit });
  },

  create: async (formData: FormData): Promise<ApiResponse<Project>> => {
    const { data } = await api.post<ApiResponse<Project>>('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: number, formData: FormData): Promise<ApiResponse<Project>> => {
    const { data } = await api.post<ApiResponse<Project>>(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete<ApiResponse<void>>(`/projects/${id}`);
    return data;
  },
};

// ============= Skills Service =============
export const skillsService = {
  getAll: async (params?: { 
    category?: string; 
    grouped?: string | boolean;
    user_id?: number;
  }): Promise<Skill[] | Record<string, Skill[]>> => {
    const queryParams = {
      ...params,
      grouped: params?.grouped ? 'true' : undefined
    };

    const response = await handleApiRequest<ApiResponse<Skill[] | Record<string, Skill[]>>>(
      api.get('/skills', { params: queryParams })
    );
    
    if (params?.grouped) {
      const extracted = extractData<Record<string, Skill[]>>(response);
      return extracted ?? {};
    }
    
    const extracted = extractData<Skill[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getGrouped: async (): Promise<Record<string, Skill[]>> => {
    const result = await skillsService.getAll({ grouped: true });
    return Array.isArray(result) ? {} : result as Record<string, Skill[]>;
  },

  create: async (data: Partial<Skill>): Promise<ApiResponse<Skill>> => {
    const { data: responseData } = await api.post<ApiResponse<Skill>>('/skills', data);
    return responseData;
  },
};

// ============= Contact Service =============
export const contactService = {
  submit: async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.post<ApiResponse<null>>('/contact/submit', formData);
      return {
        success: data.success,
        message: data.message || 'Message sent successfully!',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        message,
      };
    }
  },

  getAll: async (params?: { 
    status?: string; 
    per_page?: number; 
    page?: number;
  }): Promise<unknown[]> => {
    const response = await handleApiRequest<ApiResponse<unknown[]>>(
      api.get('/contacts', { params })
    );
    
    const extracted = extractData<unknown[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },
};

// ============= Auth Service =============
export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string; needs_onboarding: boolean }> => {
    const { data } = await api.post<ApiResponse<{ user: User; token: string; needs_onboarding: boolean }>>('/login', credentials);
    
    if (data.success && data.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
    }
    
    return data.data;
  },

  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/register', userData);
    
    if (data.success && data.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
    }
    
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },  
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await handleApiRequest<ApiResponse<User>>(
        api.get('/user')
      );

      // extraction with proper type assertions
      const userData = extractNestedData<User>(response, 'data.user')
        || extractData<User>(response);

      if (userData && (userData as User).id) {
        return userData as User;
      }

      // Check if response itself is the user object
      if (response && typeof response === 'object' && 'id' in (response as object)) {
        return response as unknown as User;
      }

      return null;
    } catch (error) {
      console.error('❌ getCurrentUser error:', error);
      return null;
    }
  },
};

// ============= Onboarding Service =============
export const onboardingService = {
  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    const { data } = await api.get<UsernameCheckResponse>(`/onboarding/check-username/${username}`);
    return data;
  },

  getStatus: async (): Promise<OnboardingStatusResponse> => {
    const { data } = await api.get<OnboardingStatusResponse>('/onboarding/status');
    return data;
  },

  complete: async (onboardingData: OnboardingData): Promise<OnboardingCompleteResponse> => {
    const { data } = await api.post<OnboardingCompleteResponse>('/onboarding/complete', onboardingData);
    return data;
  },
};

export { dashboardApi } from './dashboardApi.service';
export default api;

// ============= Testimonials Service =============
export const testimonialsService = {
  getAll: async () => {
    const response = await handleApiRequest<ApiResponse<Testimonial[]>>(api.get('/testimonials'));
    return extractData<Testimonial[]>(response) || [];
  }
};

// ============= Services Service =============
export const servicesService = {
  getAll: async () => {
    const response = await handleApiRequest<ApiResponse<Service[]>>(api.get('/services'));
    return extractData<Service[]>(response) || [];
  }
};