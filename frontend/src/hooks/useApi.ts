import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/api';
import { useState } from 'react';

// Projects
export const useProjects = (params?: Record<string, unknown>) => 
  useQuery({
    queryKey: ['projects', params],
    queryFn: () => apiClient.getProjects(params),
  });

export const useProject = (slug: string) => 
  useQuery({
    queryKey: ['project', slug],
    queryFn: () => apiClient.getProject(slug),
    enabled: !!slug,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      apiClient.updateProject(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

// Skills
export const useSkills = (params?: Record<string, unknown>) => 
  useQuery({
    queryKey: ['skills', params],
    queryFn: () => apiClient.getSkills(params),
  });

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      apiClient.updateSkill(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

// Profile
export const usePublicProfile = (username: string) => 
  useQuery({
    queryKey: ['profile', username],
    queryFn: () => apiClient.getPublicProfile(username),
    enabled: !!username,
  });

export const useCurrentProfile = () => 
  useQuery({
    queryKey: ['profile', 'current'],
    queryFn: apiClient.getCurrentProfile,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
};

// Dashboard
export const useDashboardStats = () => 
  useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: apiClient.getDashboardStats,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const useRecentProjects = (limit = 5) => 
  useQuery({
    queryKey: ['dashboard', 'recent-projects', limit],
    queryFn: () => apiClient.getRecentProjects(limit),
  });

export const useRecentMessages = (limit = 10) => 
  useQuery({
    queryKey: ['dashboard', 'recent-messages', limit],
    queryFn: () => apiClient.getRecentMessages(limit),
  });

// Experiences
export const useExperiences = (username?: string) => 
  useQuery({
    queryKey: ['experiences', username],
    queryFn: () => apiClient.getExperiences(username),
  });

export const useCreateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createExperience,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      apiClient.updateExperience(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteExperience,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
};

// Education
export const useEducation = (username?: string) => 
  useQuery({
    queryKey: ['education', username],
    queryFn: () => apiClient.getEducation(username),
  });

export const useCreateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createEducation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education'] }),
  });
};

export const useUpdateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      apiClient.updateEducation(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education'] }),
  });
};

export const useDeleteEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteEducation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education'] }),
  });
};

// Certifications
export const useCertifications = (username?: string) => 
  useQuery({
    queryKey: ['certifications', username],
    queryFn: () => apiClient.getCertifications(username),
  });

export const useCreateCertification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createCertification,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  });
};

export const useUpdateCertification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      apiClient.updateCertification(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  });
};

export const useDeleteCertification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteCertification,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  });
};

// Stats
export const useUserStats = (username: string) => 
  useQuery({
    queryKey: ['stats', username],
    queryFn: () => apiClient.getUserStats(username),
    enabled: !!username,
  });

export const useContactSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Use Record<string, unknown> instead of 'any'
  const submit = async (formData: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.submitContact(formData);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
};