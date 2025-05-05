import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LogoGenerationStatus } from '@/components/LogoGenerationStatus';
import { httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDAVTqedlG_wgVgHP1akba4RXPDWmNpaoI',
  authDomain: 'ai-logo-95de8.firebaseapp.com',
  projectId: 'ai-logo-95de8',
  storageBucket: 'ai-logo-95de8.firebasestorage.app',
  messagingSenderId: '629285714236',
  appId: '1:629285714236:web:391ba19f83caaafa46c639',
  measurementId: 'G-YG5G5EFTKN',
};

const { width } = Dimensions.get('window');
const LOGO_STYLE_SIZE = (width - 80) / 4; // 4 items per row with some padding

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export default function OpeningScreen() {
  // Input states
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('no-style');

  // Logo generation states
  const [generationStatus, setGenerationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [logoImage, setLogoImage] = useState<{ uri: string } | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Define logo styles with proper icon names that match the MAPPING in IconSymbol
  const logoStyles = [
    { id: 'no-style', name: 'No Style', icon: 'block' },
    { id: 'monogram', name: 'Monogram', icon: 'text-format' },
    { id: 'abstract', name: 'Abstract', icon: 'scatter-plot' },
    { id: 'mascot', name: 'Mascot', icon: 'pets' },
  ];

  // Array of diverse logo prompt ideas
  const logoPromptIdeas = [
    "A blue lion logo reading 'HEXA' in bold letters",
    "A minimalist mountain peak logo for 'SUMMIT' adventure company",
    "A tech-inspired logo with circuit patterns for 'NEXUS' software",
    "An elegant tree logo for 'ROOTS' organic food brand",
    "A vibrant phoenix logo for 'IGNITE' fitness studio",
    "A sleek rocket ship logo for 'LAUNCH' startup incubator",
    "A geometric owl logo for 'WISDOM' educational platform",
    "A wave-inspired logo for 'AQUA' water purification company",
    "A coffee bean logo for 'BREW' specialty coffee shop",
    "A DNA helix logo for 'GENOME' biotech research firm",
  ];

  // Function to randomly select a prompt from the array
  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * logoPromptIdeas.length);
    setPrompt(logoPromptIdeas[randomIndex]);
  };

  // Function to generate the logo
  const generateLogo = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a prompt');
      setGenerationStatus('error');
      return;
    }

    try {
      setGenerationStatus('loading');

      // Call the Firebase Function
      const generateLogoFunction = httpsCallable(functions, 'generateLogo');
      const result = await generateLogoFunction({
        prompt,
        style: selectedStyle,
      });

      // Extract the response data
      const data = result.data as {
        success: boolean;
        imageData: string;
        textResponse: string;
      };

      if (data.success && data.imageData) {
        // Set the image data
        const imageUri = `data:image/png;base64,${data.imageData}`;
        setLogoImage({ uri: imageUri });

        // Set the text response if available
        let responseText = '';
        if (data.textResponse) {
          responseText = data.textResponse;
          setTextResponse(responseText);
        }

        // Show success status briefly
        setGenerationStatus('success');
      } else {
        throw new Error('Failed to generate logo');
      }
    } catch (err) {
      console.error('Error generating logo:', err);

      // Extract more detailed error message if available
      let errorMsg = 'Failed to generate logo. Please try again.';

      if (err instanceof Error) {
        errorMsg = err.message;
      }

      console.log('Formatted error message:', errorMsg);
      setErrorMessage(errorMsg);
      setGenerationStatus('error');
    }
  };

  // Navigate to output screen when the success notification is tapped
  const handleShowDetails = () => {
    if (logoImage) {
      router.push({
        pathname: '/output',
        params: {
          imageUri: logoImage.uri,
          prompt: prompt,
          style: selectedStyle,
          textResponse: textResponse,
        },
      });
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
      }}
      darkColor="#1a1a2e"
    >
      <LinearGradient
        style={styles.container}
        colors={['rgb(14,18,38)', '#000', 'rgb(37,29,58)', '#000']}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0.25, y: 0.8 }}
      >
        {/* Logo Generation Status */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI Logo
          </ThemedText>
        </View>

        {generationStatus !== 'idle' && (
          <LogoGenerationStatus
            status={
              generationStatus === 'loading'
                ? 'loading'
                : generationStatus === 'success'
                  ? 'success'
                  : 'error'
            }
            logoImage={logoImage}
            onPress={handleShowDetails}
            errorMessage={errorMessage}
            onRetry={() => generateLogo()}
          />
        )}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.promptSection}>
            <View style={styles.promptHeader}>
              <ThemedText style={styles.sectionTitle}>
                Enter Your Prompt
              </ThemedText>
              <TouchableOpacity
                style={styles.surpriseButton}
                onPress={handleSurpriseMe}
              >
                <ThemedText style={styles.surpriseButtonText}>
                  🎲 Surprise me
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="A blue lion logo reading 'HEXA' in bold letters"
                placeholderTextColor="#666"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              <View style={styles.counterContainer}>
                <ThemedText style={styles.counter}>
                  {prompt.length}/500
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.stylesSection}>
            <ThemedText style={styles.logoTitle}>Logo Styles</ThemedText>

            <View style={styles.styleOptions}>
              {logoStyles.map((style) => (
                <View key={style.id} style={styles.styleOptionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.styleOption,
                      selectedStyle === style.id && styles.selectedStyleOption,
                    ]}
                    onPress={() => setSelectedStyle(style.id)}
                  >
                    {/* Use Material Icons directly instead of IconSymbol */}
                    <MaterialIcons
                      name={style.icon as any}
                      size={32}
                      color={selectedStyle === style.id ? '#fff' : '#666'}
                    />
                  </TouchableOpacity>
                  <ThemedText
                    style={[
                      styles.styleOptionText,
                      selectedStyle === style.id &&
                        styles.selectedStyleOptionText,
                    ]}
                  >
                    {style.name}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Create Button */}
        <TouchableOpacity
          onPress={generateLogo}
          disabled={generationStatus === 'loading'}
        >
          <LinearGradient
            colors={['#943DFF', '#2938DC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.createButton,
              generationStatus === 'loading' && styles.disabledButton,
            ]}
          >
            <ThemedText style={styles.createButtonText}>Create</ThemedText>
            <IconSymbol
              name="sparkles"
              size={16}
              color="#fff"
              style={styles.createButtonIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
  },
  promptSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    fontFamily: 'Manrope_400Regular',
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  counter: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  surpriseButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontFamily: 'Manrope_500Medium',
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stylesSection: {
    marginBottom: 30,
  },
  styleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleOption: {
    width: LOGO_STYLE_SIZE,
    height: LOGO_STYLE_SIZE,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedStyleOption: {
    backgroundColor: '#5d5fef',
    borderColor: '#fafafa',
    borderWidth: 2,
  },
  styleOptionContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: LOGO_STYLE_SIZE + 10, // Add some extra width for the text
  },
  styleOptionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Manrope_400Regular',
    marginTop: 5,
  },
  selectedStyleOptionText: {
    fontFamily: 'Manrope_700Bold',
    color: '#fff',
  },
  createButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#5d5fef',
    borderRadius: 30,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
  },
  createButtonIcon: {
    marginLeft: 8,
  },
});
