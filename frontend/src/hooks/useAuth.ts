import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient, getToken } from '@/src/lib/api';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/src/types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getToken();

  const { data: user, isLoading, error, refetch: checkAuth, isFetched } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: apiClient.getUser,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    // Type the parameter to LoginCredentials
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials.email, credentials.password),
    onSuccess: (response: AuthResponse) => {
      // Access via response.data.user per your AuthResponse interface
      queryClient.setQueryData(['user'], response.data.user);
      if (!response.data.user.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    },
  });

  const registerMutation = useMutation({
    // Use RegisterData here
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(['user'], response.data.user);
      router.push('/onboarding');
    },
  });

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
    isInitialized: !token || isFetched,
    isAuthenticated: !!token && !!user,
    token,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    checkAuth,
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
    error: (loginMutation.error as Error) || (registerMutation.error as Error) || (error as Error) || null,
  };
}
