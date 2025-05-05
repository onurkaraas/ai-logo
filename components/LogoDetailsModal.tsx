import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const { width, height } = Dimensions.get('window');

type LogoDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  logoImage: { uri: string } | null;
  prompt: string;
  style: string;
  textResponse?: string;
};

export function LogoDetailsModal({
  visible,
  onClose,
  logoImage,
  prompt,
  style,
  textResponse = '',
}: LogoDetailsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container} darkColor="#1a1a2e">
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Your Design</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Display */}
          <View style={styles.logoContainer}>
            {logoImage ? (
              <Image
                source={logoImage}
                style={styles.logoImage}
                contentFit="contain"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <ThemedText style={styles.placeholderText}>No image available</ThemedText>
              </View>
            )}
          </View>

          {/* Prompt Section */}
          <View style={styles.promptSection}>
            <ThemedText style={styles.promptTitle}>Prompt</ThemedText>
            <View style={styles.promptContainer}>
              <ThemedText style={styles.promptText}>{prompt}</ThemedText>
              <TouchableOpacity style={styles.copyButton}>
                <ThemedText style={styles.copyButtonText}>📋 Copy</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>{style}</ThemedText>
              </View>
            </View>

            {/* AI Response */}
            {textResponse ? (
              <View style={styles.aiResponseContainer}>
                <ThemedText style={styles.aiResponseTitle}>AI Response</ThemedText>
                <View style={styles.aiResponseTextContainer}>
                  <ThemedText style={styles.aiResponseText}>{textResponse}</ThemedText>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator} />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    paddingBottom: 50,
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    color: '#ffffff',
  },
  promptSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 50,
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
});
