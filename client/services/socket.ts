import { io, Socket } from 'socket.io-client';
import { Message } from '../types/instagram';

// Mock Socket.IO server URL - replace with your actual server
const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private typingCallbacks: ((data: { userId: string; isTyping: boolean }) => void)[] = [];
  private onlineStatusCallbacks: ((data: { userId: string; isOnline: boolean }) => void)[] = [];

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    // Listen for incoming messages
    this.socket.on('message', (message: Message) => {
      console.log('📨 Received message:', message);
      this.messageCallbacks.forEach(callback => callback(message));
    });

    // Listen for typing indicators
    this.socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
      this.typingCallbacks.forEach(callback => callback(data));
    });

    // Listen for online status
    this.socket.on('online_status', (data: { userId: string; isOnline: boolean }) => {
      this.onlineStatusCallbacks.forEach(callback => callback(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message
  sendMessage(message: Message) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', message);
      console.log('📤 Sent message:', message);
    } else {
      console.error('Socket not connected');
    }
  }

  // Send typing indicator
  sendTyping(receiverId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { receiverId, isTyping });
    }
  }

  // Mark message as read
  markAsRead(messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit('mark_read', { messageId });
    }
  }

  // Subscribe to new messages
  onMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to typing indicators
  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    this.typingCallbacks.push(callback);
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to online status
  onOnlineStatus(callback: (data: { userId: string; isOnline: boolean }) => void) {
    this.onlineStatusCallbacks.push(callback);
    return () => {
      this.onlineStatusCallbacks = this.onlineStatusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
