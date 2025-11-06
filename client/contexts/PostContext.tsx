import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Notification } from '../types/instagram';
import { currentUser, posts as initialPosts, users } from '../data/mockData';

interface PostContextType {
  posts: Post[];
  createPost: (image: string, caption: string, addNotification: (notif: Notification) => void) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const createPost = (image: string, caption: string, addNotification: (notif: Notification) => void) => {
    const newPost: Post = {
      id: `post${Date.now()}`,
      user: currentUser,
      image,
      likes: 0,
      caption,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false,
    };

    // Add post to beginning of feed
    setPosts(prev => [newPost, ...prev]);

    // Create notifications for followers
    // In real app, would get actual followers from backend
    // For demo, we'll notify users who follow us (users with followsYou: true)
    const followersToNotify = users.filter(user => user.followsYou);
    
    // Create notification for each follower
    followersToNotify.forEach(follower => {
      const notification: Notification = {
        id: `notif${Date.now()}_${follower.id}`,
        type: 'follow',
        user: currentUser,
        message: 'posted a new photo',
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      // Add notification (simulating that follower receives it)
      // In real app, this would be sent to backend and pushed to follower's device
      addNotification(notification);
    });
    
    console.log(`✅ Created post and notified ${followersToNotify.length} followers`);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: true, likes: post.likes + 1 }
          : post
      )
    );
  };

  const unlikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: false, likes: post.likes - 1 }
          : post
      )
    );
  };

  const savePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isSaved: true } : post
      )
    );
  };

  const unsavePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isSaved: false } : post
      )
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        deletePost,
        likePost,
        unlikePost,
        savePost,
        unsavePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
}
