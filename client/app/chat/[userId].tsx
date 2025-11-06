import React, { useState, useEffect, useRef } from 'react';
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
import { useChat } from '@/contexts/ChatContext';
import { currentUser, users } from '@/data/mockData';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { messages, sendMessage, markAsRead, getConversation, isTyping, setTyping, onlineUsers } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const otherUser = users.find(u => u.id === userId);
  const conversation = getConversation(userId as string);
  const conversationMessages = conversation ? messages[conversation.id] || [] : [];
  const isOnline = onlineUsers[userId as string];
  const otherUserTyping = isTyping[userId as string];

  useEffect(() => {
    if (conversation) {
      markAsRead(conversation.id);
    }
  }, [conversation?.id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (conversationMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationMessages.length]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !userId) return;

    sendMessage(userId as string, messageText.trim());
    setMessageText('');
    setIsUserTyping(false);
    setTyping(userId as string, false);
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);

    if (!isUserTyping && text.length > 0) {
      setIsUserTyping(true);
      setTyping(userId as string, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      setTyping(userId as string, false);
    }, 2000);
  };

  const getTimeFormat = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item, index }: any) => {
    const isMyMessage = item.senderId === currentUser.id;
    const showAvatar = !isMyMessage && (
      index === conversationMessages.length - 1 ||
      conversationMessages[index + 1]?.senderId !== item.senderId
    );

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.avatarPlaceholder}>
            {showAvatar && (
              <Image source={{ uri: otherUser?.avatar }} style={styles.messageAvatar} />
            )}
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerUser}
            onPress={() => router.push(`/user/${userId}` as any)}
          >
            <View style={styles.headerAvatarContainer}>
              <Image source={{ uri: otherUser?.avatar }} style={styles.headerAvatar} />
              {isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View>
              <Text style={styles.headerUsername}>{otherUser?.username}</Text>
              {otherUserTyping ? (
                <Text style={styles.typingText}>typing...</Text>
              ) : isOnline ? (
                <Text style={styles.activeText}>Active now</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam-outline" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputIcon}>
            <Ionicons name="camera-outline" size={24} color="#0095f6" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor="#8e8e8e"
              value={messageText}
              onChangeText={handleTextChange}
              multiline
            />
            {!messageText.trim() && (
              <View style={styles.inputIcons}>
                <TouchableOpacity style={styles.inputIconSmall}>
                  <Ionicons name="mic-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIconSmall}>
                  <Ionicons name="image-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIconSmall}>
                  <Ionicons name="happy-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {messageText.trim() ? (
            <TouchableOpacity onPress={handleSendMessage}>
              <Text style={styles.sendButton}>Send</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inputIcon}>
              <Ionicons name="heart-outline" size={24} color="#000" />
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
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00a400',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    fontSize: 12,
    color: '#00a400',
  },
  typingText: {
    fontSize: 12,
    color: '#0095f6',
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarPlaceholder: {
    width: 28,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#0095f6',
  },
  otherMessageBubble: {
    backgroundColor: '#efefef',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    gap: 12,
  },
  inputIcon: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#efefef',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
  },
  inputIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  inputIconSmall: {
    padding: 2,
  },
  sendButton: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 8,
  },
});
