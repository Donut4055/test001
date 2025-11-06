import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { currentUser } from '@/data/mockData';
import { usePost } from '@/contexts/PostContext';
import { useFriendRequest } from '@/contexts/FriendRequestContext';

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost } = usePost();
  const { addNotification } = useFriendRequest();
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelectImage = () => {
    // Mock image selection - in real app would use expo-image-picker
    const mockImages = [
      'https://picsum.photos/400/500?random=100',
      'https://picsum.photos/400/400?random=101',
      'https://picsum.photos/400/600?random=102',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImage(randomImage);
  };

  const handlePost = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    // Create post and notify followers
    createPost(selectedImage, caption, addNotification);

    Alert.alert(
      'Success',
      'Your post has been published! Followers will be notified.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={!selectedImage}
          style={[styles.postButton, !selectedImage && styles.postButtonDisabled]}
        >
          <Text style={[styles.postButtonText, !selectedImage && styles.postButtonTextDisabled]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>

        {/* Image Selection */}
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={handleSelectImage}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
            <Ionicons name="images-outline" size={80} color="#dbdbdb" />
            <Text style={styles.selectImageText}>Select Image</Text>
          </TouchableOpacity>
        )}

        {/* Caption Input */}
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#8e8e8e"
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={2200}
          />
          <Text style={styles.captionCount}>{caption.length}/2200</Text>
        </View>

        {/* Additional Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Tag People</Text>
            <Ionicons name="chevron-forward" size={20} color="#8e8e8e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Add Location</Text>
            <Ionicons name="chevron-forward" size={20} color="#8e8e8e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Advanced Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#8e8e8e" />
          </TouchableOpacity>
        </View>

        {/* Notification Info */}
        <View style={styles.notificationInfo}>
          <Ionicons name="notifications-outline" size={24} color="#0095f6" />
          <Text style={styles.notificationText}>
            Your followers will be notified about this post
          </Text>
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#8e8e8e',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  selectedImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  changeImageButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#efefef',
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectImageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#dbdbdb',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  selectImageText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8e8e8e',
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  captionInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  captionCount: {
    fontSize: 12,
    color: '#8e8e8e',
    textAlign: 'right',
    marginTop: 8,
  },
  optionsContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    marginTop: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  optionText: {
    fontSize: 16,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  notificationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0095f6',
    lineHeight: 20,
  },
});
