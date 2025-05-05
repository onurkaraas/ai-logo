import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
type ImageContextType = {
  logoImage: { uri: string } | null;
  prompt: string;
  style: string;
  textResponse: string;
  setLogoData: (data: {
    logoImage: { uri: string } | null;
    prompt: string;
    style: string;
    textResponse: string;
  }) => void;
  clearLogoData: () => void;
};

// Create the context with default values
const ImageContext = createContext<ImageContextType>({
  logoImage: null,
  prompt: '',
  style: '',
  textResponse: '',
  setLogoData: () => {},
  clearLogoData: () => {},
});

// Create a provider component
export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [logoImage, setLogoImage] = useState<{ uri: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [textResponse, setTextResponse] = useState('');

  const setLogoData = (data: {
    logoImage: { uri: string } | null;
    prompt: string;
    style: string;
    textResponse: string;
  }) => {
    setLogoImage(data.logoImage);
    setPrompt(data.prompt);
    setStyle(data.style);
    setTextResponse(data.textResponse);
  };

  const clearLogoData = () => {
    setLogoImage(null);
    setPrompt('');
    setStyle('');
    setTextResponse('');
  };

  return (
    <ImageContext.Provider
      value={{
        logoImage,
        prompt,
        style,
        textResponse,
        setLogoData,
        clearLogoData,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// Create a custom hook to use the context
export const useImageContext = () => useContext(ImageContext);
