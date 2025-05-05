import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Share,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useImageContext } from '@/context/ImageContext';

const { width } = Dimensions.get('window');

export default function OutputScreen() {
  // Get logo data from context instead of URL parameters
  const { logoImage, prompt, style, textResponse } = useImageContext();

  // State for sharing
  const [isSharing, setIsSharing] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleCopy = () => {
    // This would implement the copy functionality
    console.log('Copying prompt:', prompt);
    // In a real app, you would use Clipboard.setStringAsync(prompt)
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);

      await Share.share({
        message: `Check out this logo I created with AI Logo!\n\nPrompt: ${prompt}\nStyle: ${style}`,
        // You can't share the image directly from a data URI, but in a real app
        // you would save it to a file first and then share the file
      });
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Add a share button to the UI
  const renderShareButton = () => {
    return (
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        disabled={isSharing}
      >
        <ThemedText style={styles.shareButtonText}>
          {isSharing ? 'Sharing...' : 'Share'}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container} darkColor="#1a1a2e">
      <LinearGradient
        style={styles.container}
        colors={['rgb(14,18,38)', '#000', 'rgb(37,29,58)', '#000']}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0.25, y: 0.8 }}
      >
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Your Design</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Display */}
          <View style={styles.logoContainer}>
            {logoImage && logoImage.uri ? (
              <Image
                source={logoImage}
                style={styles.logoImage}
                contentFit="contain"
              />
            ) : (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  No image data available
                </ThemedText>
              </View>
            )}
          </View>

          {/* Prompt Section */}
          <View style={styles.promptSection}>
            <ThemedText style={styles.promptTitle}>Prompt</ThemedText>
            <View style={styles.promptContainer}>
              <ThemedText style={styles.promptText}>{prompt}</ThemedText>
              <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                <ThemedText style={styles.copyButtonText}>Copy</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>{style}</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    position: 'relative',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Manrope_400Regular',
  },
  logoContainer: {
    width: width - 40,
    height: width - 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    width: '100%',
    height: '100%',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  promptSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 50, // Add more bottom margin for scrolling
  },
  promptTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
    marginBottom: 10,
  },
  promptContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  promptText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Manrope_400Regular',
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
  },
  tagContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
  },
  aiResponseContainer: {
    marginTop: 20,
  },
  aiResponseTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
    marginBottom: 10,
  },
  aiResponseTextContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
  },
  aiResponseText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Manrope_400Regular',
  },
  shareButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#5d5fef',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
  },
  bottomIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30,
    opacity: 0.5,
  },
});
