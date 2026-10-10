const { GoogleGenAI } = require("@google/genai");

// Initialize the Google GenAI SDK using the API key from your .env file
// If the key is not present, it will log a warning so you know it's missing!
let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.warn(" Warning: GEMINI_API_KEY is not set in .env file. AI features will not work.");
}

/**
 * Generate an AI response based on chat history and the user's question.
 * @param {Array} previousMessages - An array of the last 5 messages from the database
 * @param {String} userQuestion - The specific question tagged with @ai
 * @returns {String} The AI's response text
 */
const generateAiResponse = async (previousMessages, userQuestion) => {
  if (!ai) {
    return "I am currently offline. Please configure my API key in the backend!";
  }

  try {
    // 1. Format the previous messages into a readable conversation script
    // E.g. "Rohan: Hello!", "Priya: Hi there!"
    let contextString = "Previous Conversation Context:\n";
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach((msg) => {
        // We use the sender's first name if populated, otherwise "User"
        const senderName = msg.senderId?.firstName || "User";
        contextString += `${senderName}: ${msg.text}\n`;
      });
    } else {
      contextString += "No previous context.\n";
    }

    // 2. Build the final prompt combining the system instructions, the context, and the new question
    const finalPrompt = `
      You are an expert AI assistant inside a developer networking chat app (like a mix of LinkedIn and Tinder for developers).
      You are observing a conversation between two developers. 
      Answer the user's question accurately and concisely. Use Markdown for any code snippets.
      
      ${contextString}
      
      User's Question: ${userQuestion}
    `;

    // 3. Call the Gemini API (using the ultra-fast and cost-effective flash-lite model)
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: finalPrompt,
    });

    // 4. Return the generated text
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Oops! I ran into a server error while trying to answer that. Let's talk about something else!";
  }
};

module.exports = { generateAiResponse };
