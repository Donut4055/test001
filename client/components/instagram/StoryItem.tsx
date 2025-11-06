import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Story } from '../../types/instagram';

interface StoryItemProps {
  story: Story;
  isCurrentUser?: boolean;
}

export default function StoryItem({ story, isCurrentUser }: StoryItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (isCurrentUser) {
      router.push('/create-story' as any);
    } else {
      router.push(`/user/${story.user.id}` as any);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.storyContainer}>
        {story.hasUnseenStory ? (
          <LinearGradient
            colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.innerCircle}>
              <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.seenBorder}>
            <View style={styles.innerCircle}>
              <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
            </View>
          </View>
        )}
        {isCurrentUser && (
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        )}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {isCurrentUser ? 'Your story' : story.user.username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyContainer: {
    position: 'relative',
  },
  gradient: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seenBorder: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#dbdbdb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0095f6',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 4,
    fontSize: 12,
    maxWidth: 74,
  },
});
