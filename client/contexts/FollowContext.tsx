import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FollowState {
  [userId: string]: {
    isFollowing: boolean;
    followRequestPending: boolean;
  };
}

interface FollowContextType {
  followState: FollowState;
  followUser: (userId: string, isPrivate: boolean) => void;
  unfollowUser: (userId: string) => void;
  acceptFollowRequest: (userId: string) => void;
  cancelFollowRequest: (userId: string) => void;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followState, setFollowState] = useState<FollowState>({
    '3': { isFollowing: true, followRequestPending: false }, // photographer
    '5': { isFollowing: true, followRequestPending: false }, // foodie
  });

  const followUser = (userId: string, isPrivate: boolean) => {
    setFollowState(prev => ({
      ...prev,
      [userId]: {
        isFollowing: !isPrivate,
        followRequestPending: isPrivate,
      },
    }));
  };

  const unfollowUser = (userId: string) => {
    setFollowState(prev => ({
      ...prev,
      [userId]: {
        isFollowing: false,
        followRequestPending: false,
      },
    }));
  };

  const acceptFollowRequest = (userId: string) => {
    setFollowState(prev => ({
      ...prev,
      [userId]: {
        isFollowing: true,
        followRequestPending: false,
      },
    }));
  };

  const cancelFollowRequest = (userId: string) => {
    setFollowState(prev => ({
      ...prev,
      [userId]: {
        isFollowing: false,
        followRequestPending: false,
      },
    }));
  };

  return (
    <FollowContext.Provider
      value={{
        followState,
        followUser,
        unfollowUser,
        acceptFollowRequest,
        cancelFollowRequest,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within FollowProvider');
  }
  return context;
}
