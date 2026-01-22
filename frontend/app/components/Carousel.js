import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';

const Carousel = ({ images = [] }) => {
  const [failedImages, setFailedImages] = useState(new Set());

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageError = (index) => {
    setFailedImages(prev => new Set([...prev, index]));
  };

  // Filter out failed images
  const validImages = images.filter((_, index) => !failedImages.has(index));

  if (validImages.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
      >
        {images.map((image, index) => {
          if (failedImages.has(index)) return null;
          
          return (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                onError={() => handleImageError(index)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: 300,
    height: 250,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Carousel;
