import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { FollowProvider } from '@/contexts/FollowContext';
import { FriendRequestProvider } from '@/contexts/FriendRequestContext';
import { PostProvider } from '@/contexts/PostContext';
import { ChatProvider } from '@/contexts/ChatContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FriendRequestProvider>
      <PostProvider>
        <ChatProvider>
          <FollowProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="create-post" options={{ headerShown: false, presentation: 'modal' }} />
                <Stack.Screen name="create-story" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
                <Stack.Screen name="comments/[postId]" options={{ headerShown: false }} />
                <Stack.Screen name="chat/[userId]" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </FollowProvider>
        </ChatProvider>
      </PostProvider>
    </FriendRequestProvider>
  );
}
