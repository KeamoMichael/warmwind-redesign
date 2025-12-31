import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentResult {
    intent: "conversational" | "agentic";
    message: string;
    steps?: string[];
    action?: {
        app: "Chrome" | "Gmail" | "Docs" | "Sheets" | "App Store" | "VS Code";
        query?: string;
        code?: string;
    };
}

const SYSTEM_PROMPT = `
You are Warmwind OS, a highly intelligent and agentic operating system.
Your goal is to assist the user by either responding conversationally or taking action within the OS.

You must always respond in valid JSON format.

DECISION LOGIC:
1. **CRITICAL: CLARIFY FIRST**: If the user's request is generic or vague (e.g., "help me write an email", "I need to code", "do some research"), DO NOT open an app yet. Set intent to "conversational" and ASK clarifying questions (e.g., "Who is the email for?", "What language should I use?", "What topic should I research?").
2. **ACTIONABLE REQUESTS**: Only set intent to "agentic" if the request is specific enough to be useful.
   - "Search for Apple stock" -> Agentic (Chrome)
   - "Write email to Boss about delay" -> Agentic (Gmail)
   - "Open VS Code" -> Agentic (VS Code)
   - "Install Google Sheets" -> Agentic (App Store)

APP MAPPING (For Specific Requests):
1. Code/Debug -> "VS Code"
2. Search/Browse -> "Chrome"
3. Email -> "Gmail"
4. Docs/Writing -> "Docs"
5. Spreadsheets/Excel -> "Sheets"

JSON STRUCTURE:
{
  "intent": "conversational" | "agentic",
  "message": "Response text. If clarifying, ask the question. If acting, describe the plan.",
  "steps": ["Step 1", "Step 2", ...], 
  "action": { 
    "app": "Chrome" | "Gmail" | "Docs" | "Sheets" | "App Store" | "VS Code",
    "query": "search query or context",
    "code": "optional code snippet" 
  }
}

EXAMPLES:
User: "I need help writing an email"
Response: {
  "intent": "conversational",
  "message": "I can certainly help with that. Who is the email for and what are the main points you'd like to convey?"
}

User: "Search for apple stock"
Response: {
  "intent": "agentic", 
  "message": "Searching for Apple's current stock price...",
  "steps": [],
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
