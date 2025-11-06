import apiClient from './api';
import { Post } from '../types/instagram';

export interface CreatePostRequest {
  imageUrl: string;
  caption: string;
}

class PostService {
  async getPosts(page: number = 0, size: number = 20): Promise<Post[]> {
    const response = await apiClient.get<Post[]>('/posts', {
      params: { page, size }
    });
    return response.data;
  }

  async getPostById(postId: string): Promise<Post> {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  }

  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}`);
  }

  async likePost(postId: string): Promise<Post> {
    const response = await apiClient.post<Post>(`/posts/${postId}/like`);
    return response.data;
  }

  async unlikePost(postId: string): Promise<Post> {
    const response = await apiClient.delete<Post>(`/posts/${postId}/like`);
    return response.data;
  }

  async savePost(postId: string): Promise<Post> {
    const response = await apiClient.post<Post>(`/posts/${postId}/save`);
    return response.data;
  }

  async unsavePost(postId: string): Promise<Post> {
    const response = await apiClient.delete<Post>(`/posts/${postId}/save`);
    return response.data;
  }

  async getSavedPosts(): Promise<Post[]> {
    const response = await apiClient.get<Post[]>('/posts/saved');
    return response.data;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    const response = await apiClient.get<Post[]>(`/users/${userId}/posts`);
    return response.data;
  }
}

export default new PostService();
