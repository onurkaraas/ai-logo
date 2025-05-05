import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

type LogoGenerationStatusProps = {
  status: 'loading' | 'success' | 'error';
  logoImage?: { uri: string } | null;
  onPress?: () => void;
  errorMessage?: string;
  onRetry?: () => void;
};

export function LogoGenerationStatus({
  status,
  logoImage,
  onPress,
  errorMessage = 'Failed to generate logo',
  onRetry,
}: LogoGenerationStatusProps) {
  // Animation timing state
  const [timeLeft, setTimeLeft] = useState(2);

  // Countdown effect for loading state
  useEffect(() => {
    if (status === 'loading' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, timeLeft]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={styles.loadingIndicator}
          />
          <View style={styles.loadingTextContainer}>
            <ThemedText style={styles.loadingTitle}>
              Creating Your Design...
            </ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              Ready in {timeLeft} minutes
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <View style={styles.errorIconContainer2}>
                <ThemedText style={styles.errorIcon}>!</ThemedText>
              </View>
            </View>
            <View style={styles.errorTextContainer}>
              <ThemedText style={styles.errorTitle}>
                Oops, something went wrong!
              </ThemedText>
              <ThemedText style={styles.errorSubtitle}>
                Click to try again.
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'success' && logoImage) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.successContainer}>
          <View style={styles.logoPreviewContainer}>
            <Image
              source={logoImage}
              style={styles.logoPreview}
              contentFit="contain"
            />
          </View>
          <LinearGradient
            colors={['#2938DC', '#943DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.successTextWrapper}
          >
            <View style={styles.successTextContainer}>
              <ThemedText style={styles.successTitle}>
                Your Design is Ready!
              </ThemedText>
              <ThemedText style={styles.successSubtitle}>
                Tap to see it.
              </ThemedText>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // Loading styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    height: 60,
  },
  loadingIndicator: {
    marginRight: 12,
  },
  loadingTextContainer: {
    marginLeft: 12,
  },
  loadingTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
  },
  loadingSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: '#aaaaaa',
    marginTop: 2,
  },

  // Error styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    height: 60,
  },
  errorIconContainer: {
    width: 60,
    height: 60,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: 'rgb(228,130,127)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  errorIconContainer2: {
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 16,

    fontFamily: 'Manrope_700Bold',
    color: 'rgb(228,130,127)',
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
  },
  errorSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },

  // Success styles
  successContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoPreviewContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
  },
  successTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  successTextContainer: {
    paddingHorizontal: 16,
  },
  successTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
  },
  successSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },
});
