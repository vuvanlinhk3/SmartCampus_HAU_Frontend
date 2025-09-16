import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, UserProfile, LoginResponse } from '../utils/api';

interface LoginResult {
  success: boolean;
  message?: string;
  email?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const savedAuth = localStorage.getItem('authData');
      
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          // Kiểm tra token có hợp lệ không trước khi thiết lập trạng thái
          if (authData.token && await validateToken(authData.token.accessToken)) {
            setIsAuthenticated(true);
            setUser(authData.user);
          } else {
            // Token không hợp lệ, xóa dữ liệu đã lưu
            localStorage.removeItem('authData');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error parsing saved auth data:', error);
          localStorage.removeItem('authData');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Hàm kiểm tra token có hợp lệ không
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Kiểm tra token bằng cách gọi API profile
      const response = await apiClient.getProfile();
      return response.success;
    } catch (error) {
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({
        emailOrUsername: username,
        password: password,
        rememberMe: true, // Mặc định là true như yêu cầu
      });

      if (response.success && response.data) {
        // Lấy thông tin user profile
        const profileResponse = await apiClient.getProfile();
        
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
          setIsAuthenticated(true);
          
          // Lưu cả token và thông tin user
          localStorage.setItem('authData', JSON.stringify({
            user: profileResponse.data,
            token: response.data.token,
            timestamp: Date.now()
          }));
          
          return { success: true };
        } else {
          // Nếu không lấy được profile, vẫn lưu thông tin cơ bản từ login
          const basicUserInfo: UserProfile = {
            id: response.data.userId,
            userName: response.data.userName,
            email: response.data.email,
            emailConfirmed: false,
          };
          
          setUser(basicUserInfo);
          setIsAuthenticated(true);
          
          localStorage.setItem('authData', JSON.stringify({
            user: basicUserInfo,
            token: response.data.token,
            timestamp: Date.now()
          }));
          
          return { success: true };
        }
      }

      return {
        success: false,
        message: response.message || "Đăng nhập thất bại",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authData');
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        
        // Cập nhật thông tin user mới nhất
        const savedAuth = localStorage.getItem('authData');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          localStorage.setItem('authData', JSON.stringify({
            ...authData,
            user: response.data,
            timestamp: Date.now()
          }));
        }
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      login, 
      logout, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}