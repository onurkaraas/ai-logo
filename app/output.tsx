import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width, height } = Dimensions.get('window');

export default function OutputScreen() {
  const params = useLocalSearchParams();
  const { prompt, style } = params;

  // This would be replaced with the actual logo from the API
  // For now, we're using a placeholder image
  const [logoImage, setLogoImage] = useState({
    uri: 'https://i.imgur.com/Tn5JnZR.png',
  });

  const handleClose = () => {
    router.back();
  };

  const handleCopy = () => {
    // This would implement the copy functionality
    // For now, we'll just show a console log
    console.log('Copying prompt:', prompt);
    // In a real app, you would use Clipboard.setStringAsync(prompt)
  };

  return (
    <ThemedView style={styles.container} darkColor="#1a1a2e">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Design</ThemedText>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Logo Display */}
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          style={styles.logoImage}
          contentFit="contain"
        />
      </View>

      {/* Prompt Section */}
      <View style={styles.promptSection}>
        <ThemedText style={styles.promptTitle}>Prompt</ThemedText>
        <View style={styles.promptContainer}>
          <ThemedText style={styles.promptText}>
            {prompt ||
              'A professional logo for Harrison & Co. Law Firm, using balanced serif fonts'}
          </ThemedText>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <ThemedText style={styles.copyButtonText}>📋 Copy</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {style || 'Monogram'}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
  promptSection: {
    marginTop: 20,
    paddingHorizontal: 20,
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
