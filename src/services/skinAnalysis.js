import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PROMPT = `
You are a dermatology AI. Analyze the provided face image for skin conditions like acne, redness, or irritation. 

Your response must be a valid JSON object with exactly these fields:
{
  "severity_score": (number between 0-100),
  "description": (string describing the condition),
  "affected_area_percentage": (number between 0-100)
}

Example response:
{
  "severity_score": 45,
  "description": "Mild acne on cheeks with slight redness",
  "affected_area_percentage": 30
}

Only focus on visible skin issues. Do not make assumptions about non-visible factors.
Do not include any text before or after the JSON object.
`;

// Function to extract JSON from text
function extractJSON(text) {
  console.log('Attempting to extract JSON from:', text);
  
  // Try to find JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON object found in text');
    return null;
  }

  const jsonStr = jsonMatch[0];
  console.log('Found JSON string:', jsonStr);

  try {
    const parsed = JSON.parse(jsonStr);
    console.log('Successfully parsed JSON:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

export async function analyzeSkinImage(imageFile, userId) {
  try {
    console.log('Starting skin analysis...');
    
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Convert image to base64
    console.log('Converting image to base64...');
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageArrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    console.log('Image converted to base64');

    // Initialize the Gemini API client
    console.log('Initializing Gemini client...');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('Model initialized');

    // Create the content parts
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image
      }
    };

    // Call the Gemini API
    console.log('Calling Gemini API...');
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            imagePart
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        topP: 0.1,
        topK: 16
      }
    });

    const response = await result.response;
    const analysisText = response.text();
    console.log('Raw analysis text:', analysisText);

    // Parse the response
    const analysisData = extractJSON(analysisText);
    if (!analysisData) {
      throw new Error('Failed to parse analysis response');
    }

    // Validate analysis data
    if (typeof analysisData.severity_score !== 'number' || 
        typeof analysisData.description !== 'string' || 
        typeof analysisData.affected_area_percentage !== 'number') {
      console.error('Invalid analysis data structure:', analysisData);
      throw new Error('Invalid analysis response format');
    }

    // Store the analysis result in Supabase
    console.log('Storing analysis in database...');
    try {
      const { data: analysisRecord, error: dbError } = await supabase
        .from('skin_analyses')
        .insert({
          user_id: userId,
          severity_score: analysisData.severity_score,
          description: analysisData.description,
          affected_area_percentage: analysisData.affected_area_percentage,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(dbError.message || 'Failed to store analysis in database');
      }

      if (!analysisRecord) {
        throw new Error('No data returned from database');
      }

      console.log('Analysis stored successfully:', analysisRecord);
      return {
        success: true,
        data: analysisRecord
      };
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      // Return the analysis data even if database storage failed
      return {
        success: true,
        data: {
          ...analysisData,
          user_id: userId,
          created_at: new Date().toISOString()
        },
        warning: 'Analysis completed but could not be stored in database'
      };
    }

  } catch (error) {
    console.error('Error in skin analysis:', error);
    const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred';
    
    if (errorMessage.includes('401')) {
      return {
        success: false,
        error: 'Unauthorized: Please verify your API key in Google AI Studio'
      };
    }
    
    if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit')) {
      return {
        success: false,
        error: 'API quota exceeded. Please check limits in Google AI Studio'
      };
    }

    return {
      success: false,
      error: errorMessage
    };
  }
} 