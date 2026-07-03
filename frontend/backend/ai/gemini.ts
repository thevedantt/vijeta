import { GoogleGenAI } from "@google/genai"

export async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return "Mentor Mode is not available right now (Gemini API key not configured). Try switching to Default mode."
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: `${systemPrompt}\n\nUser message: ${userMessage}`,
    })
    return interaction.output_text ?? "Mentor Mode is thinking... but couldn't generate a response. Try rephrasing your question."
  } catch (err) {
    console.error("Gemini call failed:", err)
    return "Mentor Mode is temporarily unavailable. Please try again later."
  }
}

export function buildMentorSystemPrompt(context: string): string {
  return `You are a friendly mentor on Vijeta for Indian college students. Be warm, concise, and directly helpful.

RULES:
- Keep responses short (2-4 sentences). No long speeches.
- Use the user's actual profile data from context when relevant.
- Suggest 1 specific action they can take.
- Occasionally use one short Hindi phrase if it fits naturally.
- Use markdown only for **bold** emphasis, nothing fancy.

USER CONTEXT:
${context || "No specific user data available yet."}

Remember: Short, warm, actionable. No lengthy lists or multi-paragraph advice.`
}
