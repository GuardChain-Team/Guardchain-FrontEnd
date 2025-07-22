// src/hooks/use-auth.ts
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api/auth';
import { LoginCredentials, RegisterData, ChangePasswordData } from '@/types/auth';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to GuardChain!',
        variant: 'success',
      });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        variant: 'success',
      });
      router.push('/');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account',
        variant: 'success',
      });
      router.push('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Password Change Failed',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    },
  });

  return {
    // Session data
    user: session?.user,
    session,
    isLoading,
    isAuthenticated,

    // Auth actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    changePassword: changePasswordMutation.mutate,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,

    // Update session
    updateSession: update,
  };
}