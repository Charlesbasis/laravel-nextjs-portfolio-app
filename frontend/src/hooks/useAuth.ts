import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient, getToken } from '@/src/lib/api';

interface AuthResponse {
  token: string;
  user: Record<string, unknown>;
  needs_onboarding?: boolean;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getToken();

  // Get current user
  const { data: user, isLoading, error, refetch: checkAuth } = useQuery({
    queryKey: ['user'],
    queryFn: apiClient.getUser,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      apiClient.login(email, password) as Promise<AuthResponse>, // 2. Cast the response
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      if (data.needs_onboarding) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: any) => apiClient.register(userData) as Promise<AuthResponse>,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/onboarding');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: apiClient.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!token && !!user,
    token,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    checkAuth, // 3. Export checkAuth (refetch) for the OnboardingWizard
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error || error,
  };
}
