// src/utils/token.ts
export interface AuthData {
  user: {
    id: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    name?: string;
    phone?: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    tokenType: string;
  };
  timestamp: number;
}

export const getAuthToken = (): string | null => {
  try {
    const authDataString = localStorage.getItem('authData');
    if (!authDataString) return null;
    
    const authData: AuthData = JSON.parse(authDataString);
    return authData.token.accessToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getAuthData = (): AuthData | null => {
  try {
    const authDataString = localStorage.getItem('authData');
    if (!authDataString) return null;
    
    return JSON.parse(authDataString);
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};
export const removeAuthData = (): void => {
  localStorage.removeItem('authData');
};
export const setAuthData = (data: AuthData): void => {
  localStorage.setItem('authData', JSON.stringify(data));
};