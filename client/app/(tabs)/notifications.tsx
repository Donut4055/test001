import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFriendRequest } from '@/contexts/FriendRequestContext';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const {
    notifications,
    friendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useFriendRequest();
  const router = useRouter();

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 604800)}w`;
  };

  const renderNotification = ({ item }: any) => {
    const isFriendRequest = item.type === 'friend_request';
    const friendRequest = isFriendRequest
      ? friendRequests.find(r => r.id === item.friendRequestId)
      : null;
    const isPending = friendRequest?.status === 'pending';

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => {
          markNotificationAsRead(item.id);
          router.push(`/user/${item.user.id}` as any);
        }}
      >
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.user.username}</Text>{' '}
            {item.message}
          </Text>
          <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>

          {/* Friend Request Actions */}
          {isFriendRequest && isPending && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={(e) => {
                  e.stopPropagation();
                  acceptFriendRequest(item.friendRequestId!);
                }}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={(e) => {
                  e.stopPropagation();
                  rejectFriendRequest(item.friendRequestId!);
                }}
              >
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {isFriendRequest && friendRequest?.status === 'accepted' && (
            <Text style={styles.acceptedText}>✓ Accepted</Text>
          )}
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity onPress={markAllNotificationsAsRead}>
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={80} color="#dbdbdb" />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyMessage}>
            When someone likes, comments, or sends you a friend request, you&apos;ll see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  markAllRead: {
    color: '#0095f6',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#f7f9fc',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e8e',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#0095f6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptedText: {
    color: '#00a400',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0095f6',
    position: 'absolute',
    right: 12,
    top: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 20,
  },
});
