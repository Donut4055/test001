import apiClient from './api';
import { User } from '../types/instagram';

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
  isPrivate?: boolean;
}

class UserService {
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  }

  async searchUsers(keyword: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/search', {
      params: { keyword }
    });
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>('/users/profile', data);
    return response.data;
  }

  async followUser(userId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/follow`);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users/${userId}/followers`);
    return response.data;
  }

  async getFollowing(userId: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users/${userId}/following`);
    return response.data;
  }
}

export default new UserService();
