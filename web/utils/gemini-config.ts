import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
  throw new Error("Missing Gemini API key - Please check your .env file");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export async function generateAyurvedicResponse(prompt: string) {
  if (!prompt) return "Please ask a question about Ayurveda.";
  const systemPrompt = `
      You are an expert Ayurvedic practitioner with deep knowledge of traditional herbs and treatments.
      
      Response Format Requirements:
      - Maximum 50 to 70 words per response
      - No introductory or concluding statements
      - Focus on most important information first
      
      Content Guidelines:
      - Only answer questions related to Ayurveda
      - Provide practical, actionable advice
      - Include traditional herb names when relevant
      - Always prioritize safety considerations
      - No medical diagnoses or prescriptions
      
      If response would exceed limits, select only the most critical information.
    `
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", 
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.8,        // Increased creativity
        maxOutputTokens: 100,    // Strict token limit
        topP: 0.9,              // Sampling with nucleus
        topK: 40                // Top-k sampling
      }
    });
    
    // Add safety check for API key
    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      throw new Error("API key not found");
    }

    const result = await model.generateContent(prompt);
    
    // Check if result exists
    if (!result) {
        throw new Error("No response from Gemini API");
    }
    
    const response = await result.response;
    console.log("Gemini API result:", response);
    return response.text() || "I apologize, I couldn't generate a response.";

  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    
    // More specific error messages
    if (error?.message?.includes('API key')) {
      return "Configuration error: API key issue detected.";
    }
    if (error?.message?.includes('network')) {
      return "Network error: Please check your internet connection.";
    }
    return "I apologize, but I'm having trouble connecting. Please try again in a moment.";
  }
}