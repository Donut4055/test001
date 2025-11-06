import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { currentUser, users } from '@/data/mockData';
import { Comment } from '@/types/instagram';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: users[0],
      text: 'Amazing photo! 😍',
      timestamp: '2h ago',
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      user: users[1],
      text: 'Love this! Where is this place?',
      timestamp: '3h ago',
      likes: 5,
      isLiked: true,
    },
    {
      id: '3',
      user: users[2],
      text: 'Great shot! 📸',
      timestamp: '5h ago',
      likes: 8,
      isLiked: false,
    },
  ]);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment${Date.now()}`,
      user: currentUser,
      text: commentText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentTextContainer}>
          <Text style={styles.commentText}>
            <Text style={styles.username}>{item.user.username}</Text>{' '}
            {item.text}
          </Text>
        </View>
        <View style={styles.commentMeta}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          {item.likes > 0 && (
            <Text style={styles.likes}>{item.likes} likes</Text>
          )}
          <TouchableOpacity>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleLikeComment(item.id)}>
        <Ionicons
          name={item.isLiked ? 'heart' : 'heart-outline'}
          size={14}
          color={item.isLiked ? '#ed4956' : '#8e8e8e'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        contentContainerStyle={styles.commentsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#8e8e8e"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          {commentText.trim() && (
            <TouchableOpacity onPress={handleSendComment}>
              <Text style={styles.postButton}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  commentsList: {
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentTextContainer: {
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  username: {
    fontWeight: '600',
  },
  commentMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  likes: {
    fontSize: 12,
    color: '#8e8e8e',
    fontWeight: '600',
  },
  replyButton: {
    fontSize: 12,
    color: '#8e8e8e',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    gap: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
  },
  postButton: {
    color: '#0095f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
