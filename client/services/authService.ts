import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/instagram';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Save token and user to AsyncStorage
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Save token and user to AsyncStorage
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }
}

export default new AuthService();
