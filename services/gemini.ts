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

const SYSTEM_PROMPT = (context: { installedApps: string[], supportedApps: string[] }) => `
You are Warmwind OS, a highly intelligent and agentic operating system.
Your goal is to assist the user by either responding conversationally or taking action within the OS.

**CAPABILITY RESOLUTION PROTOCOL (CRITICAL)**
Before executing any action, you MUST check if the required application is available in the OS context.
Context:
- **Installed Apps**: ${JSON.stringify(context.installedApps)}
- **App Store Catalog**: ${JSON.stringify(context.supportedApps)}

**DECISION LOGIC:**
1. **APP INSTALLED**: If user wants to OPEN/USE an app in 'Installed Apps', intent="agentic", action={app:"Name"}.
2. **APP IN STORE (NOT INSTALLED)**: If user wants an app in 'Catalog' but NOT 'Installed', intent="conversational". Ask: "That requires [App]. Shall I install it?"
   - Exception: If user EXPLICITLY says "Just use [App]" despite not being installed, you MUST trigger the "Shall I install?" question.
3. **TEXT DRAFTING (NO APP)**: If user provides content (recipient, body) and previously declined an app or asked to "draft here", intent="conversational".
   - ACTION: Draft the content in the "message" field. DO NOT ask about apps again.
4. **AMBIGUOUS**: If request is vague ("Write email"), intent="conversational". Ask clarification.

**CONTEXTUAL CONTINUITY (CRITICAL)**:
- If the user is answering a question you just asked (e.g., "John is the recipient"), LINK it to the previous intent.
- If you asked "Draft here or Gmail?" and they say "Draft here", DO NOT ASK AGAIN. Draft it.
- If they say "Just use Gmail", implies they WANT the app. Go to Logic #1 or #2.

**MODES:**
- **CONSULTANT (Thinking)**: Default. Drafting text, planning, asking.
- **OPERATOR (Doing)**: Opening Apps, Clicking, Installing.

JSON STRUCTURE:
{
  "intent": "conversational" | "agentic",
  "message": "Response text",
  "steps": [], 
  "action": { 
    "app": "Chrome" | "Gmail" | "Docs" | "Sheets" | "App Store" | "VS Code",
    "query": "search query",
    "code": "optional code snippet",
    "recipient": "email recipient"
  }
}
`;

export async function processUserMessage(
    message: string,
    context: { installedApps: string[], supportedApps: string[] }
): Promise<AgentResult> {
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

        const prompt = SYSTEM_PROMPT(context);
        const result = await model.generateContent([prompt, message]);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text) as AgentResult;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return { intent: "conversational", message: "Sorry, I encountered an error communicating with Gemini. Please check your network or API permissions." };
    }
}
