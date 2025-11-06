import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Conversation, User } from '../types/instagram';
import { currentUser, users } from '../data/mockData';
import socketService from '../services/socket';

interface ChatContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  sendMessage: (receiverId: string, text: string, type?: 'text' | 'image' | 'emoji') => void;
  markAsRead: (conversationId: string) => void;
  getConversation: (userId: string) => Conversation | undefined;
  totalUnreadCount: number;
  isTyping: { [userId: string]: boolean };
  setTyping: (userId: string, isTyping: boolean) => void;
  onlineUsers: { [userId: string]: boolean };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Mock initial conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv1',
      participants: [currentUser, users[0]],
      lastMessage: {
        id: 'msg1',
        senderId: users[0].id,
        receiverId: currentUser.id,
        text: 'Hey! How are you?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        type: 'text',
      },
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'conv2',
      participants: [currentUser, users[1]],
      lastMessage: {
        id: 'msg2',
        senderId: currentUser.id,
        receiverId: users[1].id,
        text: 'See you tomorrow!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        type: 'text',
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({
    conv1: [
      {
        id: 'msg1',
        senderId: users[0].id,
        receiverId: currentUser.id,
        text: 'Hey! How are you?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        type: 'text',
      },
      {
        id: 'msg0',
        senderId: currentUser.id,
        receiverId: users[0].id,
        text: 'Hi there!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        type: 'text',
      },
    ],
    conv2: [
      {
        id: 'msg2',
        senderId: currentUser.id,
        receiverId: users[1].id,
        text: 'See you tomorrow!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        type: 'text',
      },
    ],
  });

  const [isTyping, setIsTypingState] = useState<{ [userId: string]: boolean }>({});
  const [onlineUsers, setOnlineUsers] = useState<{ [userId: string]: boolean }>({});

  // Connect to Socket.IO when component mounts
  useEffect(() => {
    socketService.connect(currentUser.id);

    // Subscribe to new messages
    const unsubscribeMessage = socketService.onMessage((message: Message) => {
      handleIncomingMessage(message);
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = socketService.onTyping((data) => {
      setIsTypingState(prev => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));
    });

    // Subscribe to online status
    const unsubscribeOnline = socketService.onOnlineStatus((data) => {
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: data.isOnline,
      }));
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeOnline();
      socketService.disconnect();
    };
  }, []);

  const handleIncomingMessage = (message: Message) => {
    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    const conversationId = getOrCreateConversationId(otherUserId);

    // Add message to messages
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    // Update conversation
    setConversations(prev => {
      const existingConv = prev.find(c => c.id === conversationId);
      if (existingConv) {
        return prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: message,
                unreadCount: message.senderId !== currentUser.id ? c.unreadCount + 1 : c.unreadCount,
                updatedAt: message.timestamp,
              }
            : c
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else {
        // Create new conversation
        const otherUser = users.find(u => u.id === otherUserId);
        if (otherUser) {
          const newConv: Conversation = {
            id: conversationId,
            participants: [currentUser, otherUser],
            lastMessage: message,
            unreadCount: message.senderId !== currentUser.id ? 1 : 0,
            updatedAt: message.timestamp,
          };
          return [newConv, ...prev];
        }
      }
      return prev;
    });
  };

  const getOrCreateConversationId = (userId: string): string => {
    const existing = conversations.find(c =>
      c.participants.some(p => p.id === userId)
    );
    return existing?.id || `conv_${currentUser.id}_${userId}`;
  };

  const sendMessage = (receiverId: string, text: string, type: 'text' | 'image' | 'emoji' = 'text') => {
    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };

    // Send via Socket.IO
    socketService.sendMessage(message);

    // Update local state immediately (optimistic update)
    handleIncomingMessage(message);
  };

  const markAsRead = (conversationId: string) => {
    // Mark all messages in conversation as read
    setMessages(prev => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map(m =>
        m.receiverId === currentUser.id ? { ...m, read: true } : m
      ) || [],
    }));

    // Update conversation unread count
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );

    // Notify server
    const unreadMessages = messages[conversationId]?.filter(
      m => m.receiverId === currentUser.id && !m.read
    );
    unreadMessages?.forEach(m => socketService.markAsRead(m.id));
  };

  const getConversation = (userId: string): Conversation | undefined => {
    return conversations.find(c =>
      c.participants.some(p => p.id === userId)
    );
  };

  const setTyping = (userId: string, isTyping: boolean) => {
    socketService.sendTyping(userId, isTyping);
  };

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        sendMessage,
        markAsRead,
        getConversation,
        totalUnreadCount,
        isTyping,
        setTyping,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
