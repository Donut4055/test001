import apiClient from './api';
import { FriendRequest } from '../types/instagram';

class FriendRequestService {
  async sendFriendRequest(userId: string): Promise<FriendRequest> {
    const response = await apiClient.post<FriendRequest>('/friend-requests', {
      toUserId: userId
    });
    return response.data;
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    await apiClient.put(`/friend-requests/${requestId}/accept`);
  }

  async rejectFriendRequest(requestId: string): Promise<void> {
    await apiClient.put(`/friend-requests/${requestId}/reject`);
  }

  async cancelFriendRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/friend-requests/${requestId}`);
  }

  async getPendingRequests(): Promise<FriendRequest[]> {
    const response = await apiClient.get<FriendRequest[]>('/friend-requests/pending');
    return response.data;
  }

  async getSentRequests(): Promise<FriendRequest[]> {
    const response = await apiClient.get<FriendRequest[]>('/friend-requests/sent');
    return response.data;
  }
}

export default new FriendRequestService();
