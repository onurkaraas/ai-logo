import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useImageContext } from '@/context/ImageContext';

const { width } = Dimensions.get('window');

export default function OutputScreen() {
  // Get logo data from context instead of URL parameters
  const { logoImage, prompt, style, textResponse } = useImageContext();

  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<MediaLibrary.PermissionStatus | null>(null);

  // Request media library permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);

  const handleClose = () => {
    router.back();
  };

  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      await Clipboard.setStringAsync(prompt);
      Alert.alert('Success', 'Prompt copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    } finally {
      setIsCopying(false);
    }
  };

  // Function to save the image to the device
  const handleSaveImage = async () => {
    if (!logoImage || !logoImage.uri) {
      Alert.alert('Error', 'No image to save');
      return;
    }

    try {
      setIsSaving(true);

      // Check if we have permission to save to media library
      if (permissionStatus !== 'granted') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'We need permission to save images to your device'
          );
          setIsSaving(false);
          return;
        }
      }

      // For data URI, we need to first save it to a temporary file
      if (logoImage.uri.startsWith('data:')) {
        // Extract base64 data from the URI
        const base64Data = logoImage.uri.split(',')[1];

        // Create a temporary file path
        const fileUri =
          FileSystem.documentDirectory +
          'ai-logo-' +
          new Date().getTime() +
          '.png';

        // Write the base64 data to the file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save the file to the media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);

        // Create an album if it doesn't exist and add the asset to it
        const album = await MediaLibrary.getAlbumAsync('AI Logo');
        if (album === null) {
          await MediaLibrary.createAlbumAsync('AI Logo', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        // Delete the temporary file
        await FileSystem.deleteAsync(fileUri);

        Alert.alert('Success', 'Logo saved to your gallery');
      } else {
        // If it's already a file URI, just save it directly
        const asset = await MediaLibrary.createAssetAsync(logoImage.uri);
        const album = await MediaLibrary.getAlbumAsync('AI Logo');
        if (album === null) {
          await MediaLibrary.createAlbumAsync('AI Logo', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        Alert.alert('Success', 'Logo saved to your gallery');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save the image');
    } finally {
      setIsSaving(false);
    }
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
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.copyButton}
                disabled={isCopying}
              >
                <ThemedText style={styles.copyButtonText}>
                  {isCopying ? 'Copying...' : 'Copy'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>{style}</ThemedText>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* Save Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSaveImage}
              disabled={isSaving}
            >
              <ThemedText style={styles.actionButtonText}>
                {isSaving ? 'Saving...' : 'Save to Gallery'}
              </ThemedText>
            </TouchableOpacity>
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#5d5fef',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
  },
});
