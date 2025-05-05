import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from '../node_modules/expo-linear-gradient/src/LinearGradient';

const { width } = Dimensions.get('window');
const LOGO_STYLE_SIZE = (width - 80) / 4; // 4 items per row with some padding

export default function OpeningScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('no-style');

  const logoStyles = [
    { id: 'no-style', name: 'No Style', icon: 'block' },
    { id: 'monogram', name: 'Monogram', icon: 'text-format' },
    { id: 'abstract', name: 'Abstract', icon: 'scatter-plot' },
    { id: 'mascot', name: 'Mascot', icon: 'pets' },
  ];

  const handleSurpriseMe = () => {
    // This would be implemented to generate a random prompt
    setPrompt("A blue lion logo reading 'HEXA' in bold letters");
  };

  return (
    <ThemedView style={styles.container} darkColor="#1a1a2e">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI Logo
          </ThemedText>
        </View>

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
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleOption,
                  selectedStyle === style.id && styles.selectedStyleOption,
                ]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <IconSymbol
                  name={style.icon}
                  size={32}
                  color={selectedStyle === style.id ? '#fff' : '#666'}
                />
                <ThemedText
                  style={[
                    styles.styleOptionText,
                    selectedStyle === style.id &&
                      styles.selectedStyleOptionText,
                  ]}
                >
                  {style.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <Link
        href={{
          pathname: '/output',
          params: { prompt: prompt, style: selectedStyle },
        }}
        asChild
      >
        <TouchableOpacity >
        <LinearGradient
      
          colors={['#943DFF', '#2938DC']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.createButton}
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
      </Link>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
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
  },
  styleOptionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontFamily: 'Manrope_400Regular',
  },
  selectedStyleOptionText: {
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
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
  },
  createButtonIcon: {
    marginLeft: 8,
  },
});
