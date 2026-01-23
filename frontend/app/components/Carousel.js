import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';

const Carousel = ({ images = [] }) => {
  const screenWidth = Dimensions.get('window').width;
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
        scrollEventThrottle={16}
      >
        {images.map((image, index) => {
          if (failedImages.has(index)) return null;
          
          return (
            <View key={index} style={[styles.imageWrapper, { width: screenWidth - 32 }]}>
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
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    height: 250,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
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
