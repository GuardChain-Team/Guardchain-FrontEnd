// src/lib/api/auth.ts
import { apiClient } from './client';
import { apiConfig } from '@/lib/config/api';
import { 
  LoginCredentials, 
  LoginResponse, 
  RegisterData, 
  User,
  ResetPasswordData,
  ChangePasswordData 
} from '@/types/auth';
import { ApiResponse } from '@/types/global';

export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post(apiConfig.endpoints.auth.login, credentials);
    return response.data;
  },

  // Logout
  async logout(token: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post(
      apiConfig.endpoints.auth.logout,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<ApiResponse<{
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }>> {
    const response = await apiClient.post(apiConfig.endpoints.auth.refresh, {
      refreshToken,
    });
    return response.data;
  },

  // Get Profile
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get(apiConfig.endpoints.auth.profile);
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    const response = await apiClient.post(apiConfig.endpoints.auth.register, data);
    return response.data;
  },

  // Reset Password
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post(apiConfig.endpoints.auth.resetPassword, {
      email,
    });
    return response.data;
  },

  // Change Password
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    const response = await apiClient.post(apiConfig.endpoints.auth.changePassword, data);
    return response.data;
  },

  // Verify Email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend Verification Email
  async resendVerification(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  },
};