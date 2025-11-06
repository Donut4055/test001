import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { currentUser, posts } from '@/data/mockData';

const { width } = Dimensions.get('window');
const imageSize = width / 3;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'grid' | 'tagged'>('grid');

  // Filter posts by current user for demo
  const userPosts = posts.slice(0, 9);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem}>
            <Image source={{ uri: item.image }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.username}>{currentUser.username}</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.headerIcon}>
                  <Ionicons name="add-outline" size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}>
                  <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <View style={styles.statsContainer}>
                <Image source={{ uri: currentUser.avatar }} style={styles.profileImage} />
                
                <View style={styles.stats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{currentUser.posts}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{currentUser.followers?.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{currentUser.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.fullName}>{currentUser.fullName}</Text>
              <Text style={styles.bio}>{currentUser.bio}</Text>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Share profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Story Highlights */}
            <View style={styles.highlightsContainer}>
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightCircle}>
                  <Ionicons name="add" size={32} color="#000" />
                </View>
                <Text style={styles.highlightText}>New</Text>
              </TouchableOpacity>
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
          </>
        }
        showsVerticalScrollIndicator={false}
      />
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
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
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
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  highlightsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
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
  gridItem: {
    width: imageSize,
    height: imageSize,
    padding: 0.5,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
