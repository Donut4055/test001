import apiClient from './api';
import { Message, Conversation } from '../types/instagram';

export interface SendMessageRequest {
  receiverId: string;
  text: string;
  type?: 'text' | 'image' | 'emoji';
}

class MessageService {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/conversations');
    return response.data;
  }

  async getConversationById(conversationId: string): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(`/conversations/${conversationId}`);
    return response.data;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  }

  async markAsRead(messageId: string): Promise<void> {
    await apiClient.put(`/messages/${messageId}/read`);
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/messages/unread/count');
    return response.data.count;
  }
}

export default new MessageService();
