import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { currentUser } from '@/data/mockData';

export default function CreateStoryScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelectImage = () => {
    // Mock image selection
    const mockImages = [
      'https://picsum.photos/400/700?random=200',
      'https://picsum.photos/400/700?random=201',
      'https://picsum.photos/400/700?random=202',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImage(randomImage);
  };

  const handleShare = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    Alert.alert(
      'Success',
      'Your story has been shared!',
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
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Story</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          
          {/* Tools */}
          <View style={styles.tools}>
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="text" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="brush" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="happy" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="musical-notes" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={handleSelectImage}
            >
              <Text style={styles.changeButtonText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Share to Story</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.selectContainer}>
          <TouchableOpacity style={styles.selectButton} onPress={handleSelectImage}>
            <Ionicons name="images" size={80} color="#fff" />
            <Text style={styles.selectText}>Select Photo</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  selectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    alignItems: 'center',
  },
  selectText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tools: {
    position: 'absolute',
    top: 20,
    right: 16,
    gap: 20,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 12,
  },
  changeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#0095f6',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
