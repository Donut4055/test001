import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import Header from '@/components/instagram/Header';
import StoryItem from '@/components/instagram/StoryItem';
import PostItem from '@/components/instagram/PostItem';
import { stories } from '@/data/mockData';
import { usePost } from '@/contexts/PostContext';

export default function HomeScreen() {
  const { posts } = usePost();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem post={item} />}
        ListHeaderComponent={
          <View style={styles.storiesContainer}>
            <FlatList
              data={stories}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <StoryItem story={item} isCurrentUser={index === 0} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesList}
            />
          </View>
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
  storiesContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 12,
  },
  storiesList: {
    paddingHorizontal: 12,
  },
});
