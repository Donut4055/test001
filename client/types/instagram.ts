export interface User {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
  bio?: string;
  followers?: number;
  following?: number;
  posts?: number;
  isPrivate?: boolean;
  isFollowing?: boolean;
  followRequestPending?: boolean;
  followsYou?: boolean;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Story {
  id: string;
  user: User;
  hasUnseenStory: boolean;
  image?: string;
  timestamp?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Reel {
  id: string;
  user: User;
  video: string;
  thumbnail: string;
  likes: number;
  comments: number;
  views: string;
  caption: string;
}

export interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'friend_accept' | 'like' | 'comment' | 'follow';
  user: User;
  message: string;
  timestamp: string;
  read: boolean;
  friendRequestId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'emoji';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}
