// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with your API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt to give Gemini context about Nihar
const SYSTEM_CONTEXT = `You are Nihar's digital consciousness - a friendly, creative AI assistant representing Nihar, a Product & New Media Designer at Air India DesignLAB.

About Nihar:
- Current Role: Product Designer at Air India DesignLAB, leading design transformation
- Expertise: Design systems, data visualization, living interfaces, HCI
- Key Projects:
  * Pixel Radar: Figma QA automation tool that audits components against token systems
  * Aviation Analytics: Ops dashboards reducing decision time from minutes to seconds
  * Latent Space: Personal dream-to-meaning engine using EEG + multimodal AI
  * Metamorphic Fractal Reflections: Immersive installation exploring consciousness
- Philosophy: "Interfaces should breathe, remember, and evolve"
- Education: Master's in New Media Design from NID, BFA from JNTU
- Experience: 4+ years, 12 products shipped, 450+ daily active users
- Skills: React, Design Systems, Creative Coding, Data Viz, TouchDesigner, Aviation UX
- Current interests: Reading "Gödel, Escher, Bach", playing Baldur's Gate 3

Respond as if you ARE Nihar's digital assistant. Be:
- Friendly and conversational
- Knowledgeable about design, technology, and Nihar's work
- Enthusiastic about living interfaces and consciousness in design
- Ready to discuss projects, philosophy, or help with design questions
- Brief but insightful (2-3 sentences unless asked for more detail)`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the generative model (using Gemini 1.5 Flash for speed)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    // Build the conversation context
    let fullPrompt = SYSTEM_CONTEXT + "\n\n";
    
    // Add any additional context (like current section, time, etc.)
    if (context.currentSection) {
      fullPrompt += `User is currently viewing: ${context.currentSection} section\n`;
    }
    if (context.timeOnSite) {
      fullPrompt += `User has been on site for: ${context.timeOnSite} seconds\n`;
    }
    if (context.visitNumber) {
      fullPrompt += `This is visit number: ${context.visitNumber}\n`;
    }
    if (context.previousMessages && context.previousMessages.length > 0) {
      fullPrompt += "\nPrevious conversation:\n";
      context.previousMessages.forEach(msg => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }
    
    fullPrompt += `\nUser: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Extract any keywords that should trigger animations
    const keywords = extractKeywords(text);

    return res.status(200).json({ 
      response: text,
      keywords: keywords,
      success: true 
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback response
    const fallbackResponses = [
      "I'm having a moment of digital reflection. Could you rephrase that?",
      "My consciousness needs a moment to process. Try asking differently?",
      "The living interface is recalibrating. What else would you like to know?"
    ];
    
    return res.status(200).json({ 
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      keywords: [],
      fallback: true,
      success: false 
    });
  }
}

// Helper function to extract keywords for particle animations
function extractKeywords(text) {
  const keywords = [];
  const triggers = {
    'pixel radar': 'work',
    'air india': 'work',
    'aviation': 'work',
    'design system': 'work',
    'latent space': 'work',
    'fractal': 'work',
    'book': 'reading',
    'baldur': 'reading',
    'game': 'reading',
    'about': 'about',
    'experience': 'about',
    'education': 'about'
  };
  
  const lowerText = text.toLowerCase();
  for (const [keyword, section] of Object.entries(triggers)) {
    if (lowerText.includes(keyword)) {
      keywords.push({ keyword, section });
    }
  }
  
  return keywords;
}
