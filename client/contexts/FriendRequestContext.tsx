import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FriendRequest, Notification, User } from '../types/instagram';
import { currentUser, users } from '../data/mockData';

interface FriendRequestContextType {
  friendRequests: FriendRequest[];
  notifications: Notification[];
  friends: string[]; // Array of user IDs
  sendFriendRequest: (toUser: User) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  cancelFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Notification) => void;
  isFriend: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
  hasSentRequest: (userId: string) => boolean;
  unreadCount: number;
}

const FriendRequestContext = createContext<FriendRequestContextType | undefined>(undefined);

export function FriendRequestProvider({ children }: { children: ReactNode }) {
  // Mock initial friend requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'req1',
      from: users[0], // johndoe
      to: currentUser,
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 'req2',
      from: users[3], // traveler
      to: currentUser,
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
  ]);

  // Mock initial notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif1',
      type: 'friend_request',
      user: users[0],
      message: 'sent you a friend request',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      friendRequestId: 'req1',
    },
    {
      id: 'notif2',
      type: 'friend_request',
      user: users[3],
      message: 'sent you a friend request',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      friendRequestId: 'req2',
    },
  ]);

  // Mock initial friends
  const [friends, setFriends] = useState<string[]>(['3', '5']); // photographer and foodie

  const sendFriendRequest = (toUser: User) => {
    const newRequest: FriendRequest = {
      id: `req${Date.now()}`,
      from: currentUser,
      to: toUser,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setFriendRequests(prev => [...prev, newRequest]);
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'accepted' as const } : r))
    );

    // Add to friends
    setFriends(prev => [...prev, request.from.id]);

    // Update notification
    setNotifications(prev =>
      prev.map(n =>
        n.friendRequestId === requestId ? { ...n, read: true } : n
      )
    );

    // Add new notification for acceptance
    const newNotification: Notification = {
      id: `notif${Date.now()}`,
      type: 'friend_accept',
      user: request.from,
      message: 'You are now friends',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    );

    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.friendRequestId === requestId ? { ...n, read: true } : n
      )
    );
  };

  const cancelFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const removeFriend = (userId: string) => {
    setFriends(prev => prev.filter(id => id !== userId));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isFriend = (userId: string) => {
    return friends.includes(userId);
  };

  const hasPendingRequest = (userId: string) => {
    return friendRequests.some(
      r => r.from.id === userId && r.to.id === currentUser.id && r.status === 'pending'
    );
  };

  const hasSentRequest = (userId: string) => {
    return friendRequests.some(
      r => r.from.id === currentUser.id && r.to.id === userId && r.status === 'pending'
    );
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <FriendRequestContext.Provider
      value={{
        friendRequests,
        notifications,
        friends,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        cancelFriendRequest,
        removeFriend,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        isFriend,
        hasPendingRequest,
        hasSentRequest,
        unreadCount,
      }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
}

export function useFriendRequest() {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error('useFriendRequest must be used within FriendRequestProvider');
  }
  return context;
}
