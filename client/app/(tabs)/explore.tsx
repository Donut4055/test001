import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const imageSize = (width - 3) / 3;

// Mock explore grid data
const exploreImages = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  uri: `https://picsum.photos/400/400?random=${i + 20}`,
  likes: Math.floor(Math.random() * 10000),
}));

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#8e8e8e" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8e8e8e"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={exploreImages}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem}>
            <Image source={{ uri: item.uri }} style={styles.gridImage} />
            <View style={styles.overlay}>
              <View style={styles.overlayContent}>
                <Ionicons name="heart" size={20} color="#fff" />
                <Text style={styles.overlayText}>{item.likes.toLocaleString()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.row}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  row: {
    gap: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    marginBottom: 1,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
});
