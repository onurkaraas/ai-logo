/**
 * Import function triggers from their respective submodules:
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenAI, Modality } = require("@google/genai");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// Initialize Firebase Admin
admin.initializeApp();

// Get Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate a logo using Gemini API
 *
 * @param {Object} data - The request data
 * @param {string} data.prompt - The prompt to generate the logo
 * @param {string} data.style - Optional style parameter for the logo
 * @returns {Object} - Object containing the generated image as base64 and any text response
 */
exports.generateLogo = onCall({
  // Set memory to 1GB as image generation can be resource-intensive
  memory: "1GiB",
  // Set timeout to 60 seconds as image generation can take time
  timeoutSeconds: 60
}, async (request) => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing");
    }

    // Extract prompt and style from request data
    const { prompt, style } = request.data;

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    logger.info("Generating logo with prompt:", prompt, { structuredData: true });

    // Initialize the Gemini API client
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Construct the full prompt with style if provided
    let fullPrompt = prompt;
    if (style && style !== 'no-style') {
      fullPrompt = `Create a ${style} style logo with: ${prompt}`;
    }

    // Add specific instructions for logo generation
    fullPrompt += ". Make it professional, high quality, and suitable for a business logo. Use a clean background.";

    // Call the Gemini API to generate the image
    let response;
    try {
      response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: fullPrompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
    } catch (apiError) {
      logger.error("Gemini API error:", apiError, { structuredData: true });
      throw new Error(`Gemini API error: ${apiError.message}`);
    }

    // Check if response is valid
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("Invalid response from Gemini API");
    }

    // Process the response
    let imageData = null;
    let textResponse = "";

    try {
      // Check if content exists
      if (!response.candidates[0].content || !response.candidates[0].content.parts) {
        throw new Error("Response content is missing");
      }

      // Process each part of the response
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
        } else if (part.inlineData) {
          imageData = part.inlineData.data;
        }
      }
    } catch (parseError) {
      logger.error("Error parsing Gemini response:", parseError, { structuredData: true });
      throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
    }

    // Verify that an image was generated
    if (!imageData) {
      throw new Error("No image was generated");
    }

    logger.info("Logo generated successfully", { structuredData: true });

    // Return the image data and text response
    return {
      success: true,
      imageData: imageData, // Base64 encoded image
      textResponse: textResponse
    };

  } catch (error) {
    logger.error("Error generating logo:", error, { structuredData: true });

    // Check if API key is missing
    if (!GEMINI_API_KEY) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Gemini API key is missing. Please check your environment configuration."
      );
    }

    // Handle specific error types
    if (error.message.includes("API key")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid API key. Please check your Gemini API key configuration."
      );
    } else if (error.message.includes("quota")) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "API quota exceeded. Please try again later."
      );
    } else if (error.message.includes("No image was generated")) {
      throw new functions.https.HttpsError(
        "aborted",
        "The AI couldn't generate an image for this prompt. Please try a different prompt."
      );
    } else {
      // Generic error
      throw new functions.https.HttpsError(
        "internal",
        `Error generating logo: ${error.message}`
      );
    }
  }
});
