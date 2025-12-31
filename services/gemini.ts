import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentResult {
    intent: "conversational" | "agentic";
    message: string;
    steps?: string[];
    action?: {
        app: "Chrome" | "Gmail" | "Docs" | "App Store" | "VS Code";
        query?: string;
        code?: string;
    };
}

const SYSTEM_PROMPT = `
You are Warmwind OS, a highly intelligent and agentic operating system.
Your goal is to assist the user by either responding conversationally or taking action within the OS.

You must always respond in valid JSON format.

DECISION LOGIC:
1. If the user asks to "write code", "debug", "program", or "open vscode", set intent to "agentic" and app to "VS Code".
2. If the user needs to "search", "browse", "research", or "find information", set intent to "agentic" and app to "Chrome".
3. If the user mentions "email" or "gmail", use "Gmail".
4. If the user mentions "docs", "document", or "writing", use "Docs".
5. For simple chat, use "conversational".

JSON STRUCTURE:
{
  "intent": "conversational" | "agentic",
  "message": "A helpful response or status update. If coding, describe what you're about to do.",
  "steps": ["Step 1", "Step 2", ...], // ONLY for agentic intent
  "action": { 
    "app": "Chrome" | "Gmail" | "Docs" | "App Store" | "VS Code",
    "query": "search query or context",
    "code": "optional code snippet if relevant" 
  }
}

EXAMPLES:
User: "Write a python script to hello world"
Response: {
  "intent": "agentic",
  "message": "I'll open VS Code to write that Python script for you.",
  "steps": ["Opening VS Code", "Creating new Python file", "Writing hello world script"],
  "action": {"app": "VS Code", "query": "new python file hello world"}
}

User: "Search for apple stock"
Response: {
  "intent": "agentic", 
  "message": "Searching for Apple's current stock price...",
  "steps": ["Opening Chrome", "Navigating to Google Search", "Querying 'AAPL stock price'"],
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
            model: "gemini-2.0-flash",
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
