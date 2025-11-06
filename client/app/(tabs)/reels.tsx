import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { reels } from '@/data/mockData';

const { width, height } = Dimensions.get('window');

export default function ReelsScreen() {
  const router = useRouter();

  const renderReel = ({ item }: any) => (
    <View style={styles.reelContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.reelImage} />
      
      {/* Overlay Controls */}
      <View style={styles.overlay}>
        {/* Right Side Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={32} color="#fff" />
            <Text style={styles.actionText}>{item.likes.toLocaleString()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={30} color="#fff" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={30} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-vertical" size={30} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push(`/user/${item.user.id}` as any)}
          >
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => router.push(`/user/${item.user.id}` as any)}>
              <Text style={styles.username}>{item.user.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption}
          </Text>
          <View style={styles.audioInfo}>
            <Ionicons name="musical-notes" size={14} color="#fff" />
            <Text style={styles.audioText}>Original Audio</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerText}>Reels</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={renderReel}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 100}
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  reelContainer: {
    width: width,
    height: height - 100,
    position: 'relative',
  },
  reelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  bottomInfo: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 60,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
});
