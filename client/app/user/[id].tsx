import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { users, posts } from '@/data/mockData';
import { useFollow } from '@/contexts/FollowContext';
import { useFriendRequest } from '@/contexts/FriendRequestContext';

const { width } = Dimensions.get('window');
const imageSize = width / 3;

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { followState, followUser, unfollowUser, cancelFollowRequest } = useFollow();
  const { isFriend, hasPendingRequest, hasSentRequest, sendFriendRequest, removeFriend } = useFriendRequest();
  const [activeTab, setActiveTab] = useState<'grid' | 'tagged'>('grid');

  // Find user by id
  const user = users.find(u => u.id === id);
  
  // Get follow state from context
  const userFollowState = followState[id as string] || { isFollowing: user?.isFollowing || false, followRequestPending: false };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User not found</Text>
      </SafeAreaView>
    );
  }

  // Use user stats from data
  const userStats = {
    posts: user?.posts || 0,
    followers: user?.followers || 0,
    following: user?.following || 0,
  };

  // Filter posts for demo - only show if not private or if following
  const canViewPosts = !user?.isPrivate || userFollowState.isFollowing;
  const userPosts = canViewPosts ? posts.slice(0, 9) : [];

  const handleFollowPress = () => {
    if (userFollowState.isFollowing) {
      unfollowUser(id as string);
    } else if (userFollowState.followRequestPending) {
      cancelFollowRequest(id as string);
    } else {
      followUser(id as string, user?.isPrivate || false);
    }
  };

  const getFollowButtonText = () => {
    if (userFollowState.followRequestPending) return 'Requested';
    if (userFollowState.isFollowing) return 'Following';
    return 'Follow';
  };

  const getFollowButtonStyle = () => {
    if (userFollowState.isFollowing || userFollowState.followRequestPending) {
      return styles.followingButton;
    }
    return styles.followButton;
  };

  const handleAddFriendPress = () => {
    if (isFriend(id as string)) {
      removeFriend(id as string);
    } else if (hasSentRequest(id as string)) {
      // Cancel sent request - in real app, would get request ID from context
      // For now, just don't do anything
    } else if (!hasPendingRequest(id as string)) {
      sendFriendRequest(user);
    }
  };

  const getAddFriendIcon = () => {
    if (isFriend(id as string)) return 'person-remove-outline';
    if (hasSentRequest(id as string)) return 'person-add';
    if (hasPendingRequest(id as string)) return 'checkmark-circle';
    return 'person-add-outline';
  };

  const renderPrivateMessage = () => (
    <View style={styles.privateContainer}>
      <View style={styles.lockIconContainer}>
        <Ionicons name="lock-closed" size={80} color="#000" />
      </View>
      <Text style={styles.privateTitle}>This Account is Private</Text>
      <Text style={styles.privateMessage}>
        Follow this account to see their photos and videos.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.username}>{user?.username}</Text>
            {user?.isPrivate && (
              <Ionicons name="lock-closed" size={14} color="#000" style={styles.lockIcon} />
            )}
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.statsContainer}>
            <Image source={{ uri: user?.avatar }} style={styles.profileImage} />
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.fullName}>{user?.fullName}</Text>
          {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
          {user?.followsYou && (
            <View style={styles.followsYouBadge}>
              <Text style={styles.followsYouText}>Follows you</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={getFollowButtonStyle()}
              onPress={handleFollowPress}
            >
              <Text style={[styles.followButtonText, (userFollowState.isFollowing || userFollowState.followRequestPending) && styles.followingButtonText]}>
                {getFollowButtonText()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.moreButton,
                isFriend(id as string) && styles.friendButton
              ]}
              onPress={handleAddFriendPress}
            >
              <Ionicons 
                name={getAddFriendIcon()} 
                size={20} 
                color={isFriend(id as string) ? '#00a400' : '#000'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons
              name="grid-outline"
              size={24}
              color={activeTab === 'grid' ? '#000' : '#8e8e8e'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tagged' && styles.activeTab]}
            onPress={() => setActiveTab('tagged')}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={activeTab === 'tagged' ? '#000' : '#8e8e8e'}
            />
          </TouchableOpacity>
        </View>

        {/* Content - Show private message or posts */}
        {!canViewPosts ? (
          renderPrivateMessage()
        ) : (
          <View style={styles.gridContainer}>
            {userPosts.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem}>
                <Image source={{ uri: item.image }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
  },
  lockIcon: {
    marginLeft: 6,
  },
  profileInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 28,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  fullName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  followsYouBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#efefef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  followsYouText: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#0095f6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#efefef',
  },
  followButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  followingButtonText: {
    color: '#000',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  moreButton: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendButton: {
    backgroundColor: '#e8f5e9',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    padding: 0.5,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  privateContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  lockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  privateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  privateMessage: {
    fontSize: 14,
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 20,
  },
});
