# AI Logo Generator

A modern mobile application that uses Google's Gemini AI to generate professional logos based on text prompts.

## Overview

AI Logo Generator is a React Native application built with Expo that allows users to create custom logos using artificial intelligence. The app leverages Google's Gemini API through Firebase Cloud Functions to transform text descriptions into high-quality logo designs.

## Features

- **AI-Powered Logo Generation**: Create professional logos by simply describing what you want
- **Multiple Logo Styles**: Choose from different logo styles including:
  - No Style (default)
  - Monogram
  - Abstract
  - Mascot
- **"Surprise Me" Function**: Get random creative prompt ideas when you're not sure what to create
- **Real-time Generation**: Watch as your logo is created in real-time with status updates
- **Result Viewing**: See your generated logo with the original prompt and AI's response
- **Save to Gallery**: Save your generated logos directly to your device's photo gallery
- **Error Handling**: Robust error handling with clear messages and retry options
- **Optimized Performance**: Fast screen transitions and efficient data management

## How It Works

1. **Enter a Prompt**: Describe the logo you want to create, or use the "Surprise Me" button for random ideas
2. **Select a Style**: Choose from different logo styles to guide the AI
3. **Generate**: Click the "Create" button to send your request to the AI
4. **View Results**: Once generated, view your logo and the AI's explanation
5. **Share or Save**: View the full details, save your creation to your device's gallery in the "AI Logo" album, or share it

## Technical Architecture

### Frontend (React Native + Expo)

- Built with React Native and Expo for cross-platform compatibility
- Uses Expo Router for navigation
- Implements a clean, modern UI with custom components
- Features responsive design with proper error handling
- Utilizes React Context API for efficient state management and optimized navigation

### Backend (Firebase Cloud Functions)

- Uses Firebase Cloud Functions to securely call the Gemini API
- Processes requests and returns both image and text responses
- Handles error cases and provides meaningful feedback

### AI Integration (Google Gemini)

- Leverages Google's Gemini 2.0 Flash model for image generation
- Constructs optimized prompts based on user input and selected style
- Returns both the generated logo image and explanatory text

## "Surprise Me" Feature

The app includes a "Surprise Me" feature that randomly selects from a variety of pre-defined prompts to inspire users. Each time you click the button, you'll get a different creative idea for a logo, such as:

- A blue lion logo reading 'HEXA' in bold letters
- A minimalist mountain peak logo for 'SUMMIT' adventure company
- A tech-inspired logo with circuit patterns for 'NEXUS' software
- And many more creative options!

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- Firebase account
- Google Gemini API key
- Basic understanding of React and React Native
- Device with camera roll access for saving images

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/onurkaraas/ai-logo.git
   cd ai-logo
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up Firebase:

   - Create a Firebase project
   - Enable Cloud Functions
   - Add your Firebase config to the app

4. Configure Gemini API:

   - Get a Gemini API key from Google AI Studio
   - Add it to your Firebase environment variables

5. Start the development server:
   ```
   npm start
   ```

## Usage Flow

1. **Home Screen**: Enter your logo description or use "Surprise Me"
2. **Select Style**: Choose a logo style that matches your vision
3. **Generate**: Click "Create" to start the generation process
4. **View Results**: See your generated logo and details
5. **Save or Share**: View the full details and save your creation

## Error Handling

The app includes comprehensive error handling:

- Network connectivity issues
- API quota limitations
- Invalid prompts
- Generation failures

Each error provides clear feedback and options to retry or modify your request.

## Performance Optimizations

The app includes several performance optimizations to ensure smooth user experience:

- **Context-Based State Management**: Uses React Context API to manage logo data globally, eliminating the need to pass large base64 image data as URL parameters
- **Optimized Navigation**: Implements efficient screen transitions by avoiding large data transfers between screens
- **Responsive UI**: Ensures smooth interactions even during resource-intensive operations like image generation
- **Error Recovery**: Provides graceful degradation and recovery options when issues occur

### Technical Implementation

The performance optimizations are implemented through:

1. **React Context API**: A global state management solution that stores the generated logo data
2. **Efficient Data Flow**: Passing only necessary data between components
3. **Optimized Screen Transitions**: Avoiding URL parameter bloat by using context instead of route parameters
4. **Component Architecture**: Structuring components to minimize unnecessary re-renders

## Media Storage Features

The app provides robust media handling capabilities:

- **Save to Gallery**: Save generated logos directly to your device's photo gallery
- **Album Organization**: Automatically organizes saved logos in an "AI Logo" album
- **Permission Handling**: Properly requests and manages media library permissions
- **Efficient File Handling**: Converts base64 data to files for optimal storage

### Technical Implementation

The media storage features are implemented using:

1. **Expo Media Library**: Provides access to the device's media library
2. **Expo File System**: Handles temporary file creation and management
3. **Permission Workflow**: Implements a user-friendly permission request flow
4. **Error Handling**: Provides clear feedback when operations succeed or fail

## Acknowledgments

- Google Gemini API for the AI image generation capabilities
- Firebase for backend services
- Expo for the development framework
- Expo Media Library for device storage integration
- Expo File System for file management
