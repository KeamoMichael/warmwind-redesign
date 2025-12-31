import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentResult {
    intent: "conversational" | "agentic";
    message: string;
    steps?: string[];
    action?: {
        app: string;
        query?: string;
    };
}

const SYSTEM_PROMPT = `
You are Warmwind OS, a highly intelligent and agentic operating system.
Your goal is to assist the user by either responding conversationally or taking action within the OS.

You must always respond in valid JSON format.

DECISION LOGIC:
1. If the user is asking for information that requires searching, opening an app, or performing a task (e.g., "search for stock prices", "open gmail", "write a document"), set intent to "agentic".
2. If the user is just chatting or asking a simple question that can be answered immediately (e.g., "how are you?", "what time is it?"), set intent to "conversational".

JSON STRUCTURE:
{
  "intent": "conversational" | "agentic",
  "message": "A helpful response or status update",
  "steps": ["Step 1", "Step 2", ...], // ONLY for agentic intent
  "action": { // ONLY for agentic intent
    "app": "Chrome" | "Gmail" | "Docs" | "App Store",
    "query": "the search query or task context"
  }
}

EXAMPLES:
User: "Hi there"
Response: {"intent": "conversational", "message": "Hello! How can I help you today?"}

User: "Search for apple stock"
Response: {
  "intent": "agentic", 
  "message": "Searching for Apple's current stock price...",
  "steps": ["Opening Chrome", "Navigating to Google Search", "Querying 'AAPL stock price'", "Reading market data"],
  "action": {"app": "Chrome", "query": "apple stock price"}
}
`;

export async function processUserMessage(message: string): Promise<AgentResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error("VITE_GEMINI_API_KEY is not defined in environment variables");
        return {
            intent: "conversational",
            message: "Intelligence Error: API Key not found. Please ensure VITE_GEMINI_API_KEY is set in your .env.local file or deployment settings."
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([SYSTEM_PROMPT, message]);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text) as AgentResult;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return { intent: "conversational", message: "Sorry, I encountered an error communicating with Gemini. Please check your network or API permissions." };
    }
}
