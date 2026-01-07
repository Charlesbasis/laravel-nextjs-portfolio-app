
import { useQuery } from '@tanstack/react-query';
import {
  profileService,
  experienceService,
  educationService,
  certificationService,
} from '@/src/services/profile.service';

/**
 * Hook to fetch public profile by username
 */
export function usePublicProfile(username: string, initialData?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['profile', 'public', username],
    queryFn: () => profileService.getByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    initialData, // React Query will use this immediately
  });
}

/**
 * Hook to fetch current user's profile
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: ['profile', 'current'],
    queryFn: profileService.getCurrent,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user stats
 */
export function useUserStats(username: string) {
  return useQuery({
    queryKey: ['stats', username],
    queryFn: () => profileService.getStats(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch public experiences
 */
export function usePublicExperiences(username: string) {
  return useQuery({
    queryKey: ['experiences', 'public', username],
    queryFn: () => experienceService.getByUsername(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's experiences
 */
export function useExperiences() {
  return useQuery({
    queryKey: ['experiences', 'current'],
    queryFn: experienceService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch public education
 */
export function usePublicEducation(username: string) {
  return useQuery({
    queryKey: ['education', 'public', username],
    queryFn: () => educationService.getByUsername(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's education
 */
export function useEducation() {
  return useQuery({
    queryKey: ['education', 'current'],
    queryFn: educationService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch public certifications
 */
export function usePublicCertifications(username: string) {
  return useQuery({
    queryKey: ['certifications', 'public', username],
    queryFn: () => certificationService.getByUsername(username),
    enabled: !!username,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's certifications
 */
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications', 'current'],
    queryFn: certificationService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
