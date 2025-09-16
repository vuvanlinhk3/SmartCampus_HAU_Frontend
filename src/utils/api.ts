// src/utils/api.ts
import { getAuthToken, getAuthData } from './token';

const API_BASE_URL = 'https://localhost:7072/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface LoginDTO {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterDTO {
  UserName: string;
  Email: string;
  Password: string;
  Name?: string;
  Phone?: string;
}

export interface ResetPasswordDTO {
  Email: string;
  Token: string;
  NewPassword: string;
}

export interface ChangePasswordDTO {
  OldPassword: string;
  NewPassword: string;
}

export interface UpdateUserInfoDTO {
  Name?: string;
  Phone?: string;
  Email?: string;
}

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  name?: string;
  phone?: string;
  emailConfirmed: boolean;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  tokenType: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  userName: string;
  token: TokenData;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = getAuthToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        credentials: 'include',
        headers,
        ...options,
      });

      // Xử lý response 401 (Unauthorized)
      if (response.status === 401) {
        localStorage.removeItem('authData');
        return {
          success: false,
          message: 'Phiên đăng nhập đã hết hạn',
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          return {
            success: false,
            message: errorJson.message || `HTTP ${response.status}`,
            errors: errorJson.errors,
          };
        } catch {
          return {
            success: false,
            message: errorText || `HTTP ${response.status}`,
          };
        }
      }

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async login(loginData: LoginDTO): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/Auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<TokenData>> {
    const authData = getAuthData();
    if (!authData) {
      return { success: false, message: 'No auth data found' };
    }

    return this.request<TokenData>('/Auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: authData.token.refreshToken }),
    });
  }

  async register(registerData: RegisterDTO): Promise<ApiResponse> {
    return this.request('/User/user/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async confirmEmail(userId: string, token: string): Promise<ApiResponse> {
    return this.request(`/User/user/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  }

  async resendConfirmation(email: string): Promise<ApiResponse> {
    return this.request('/User/user/resend-confirmation', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/User/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetToken(token: string): Promise<ApiResponse> {
    return this.request(`/User/user/verify-reset-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  }

  async resetPassword(resetData: ResetPasswordDTO): Promise<ApiResponse> {
    return this.request('/User/user/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/User/user/profile', {
      method: 'GET',
    });
  }

  async changePassword(changeData: ChangePasswordDTO): Promise<ApiResponse> {
    return this.request('/User/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(changeData),
    });
  }

  async updateUserInfo(updateData: UpdateUserInfoDTO): Promise<ApiResponse> {
    return this.request('/User/user/update-info', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteUser(): Promise<ApiResponse> {
    return this.request('/User/user/delete', {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);