import { GoogleGenAI } from "@google/genai";

// Helper to clean and parse JSON even if it's slightly malformed or conversational
function robustJsonParse(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error('No JSON structure found in response');
  }

  let jsonStr = text.substring(start, end + 1);
  
  // Basic cleanup for common LLM JSON mistakes
  jsonStr = jsonStr
    .replace(/,\s*}/g, '}') // Trailing commas in objects
    .replace(/,\s*]/g, ']') // Trailing commas in arrays
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Control characters

  return JSON.parse(jsonStr);
}

// Helper to map unpredictable AI fields to our expected schema
function mapFields(data) {
  const result = {
    score: data.score || data.rating || data.assessment?.score || data.ats_score || 70,
    strengths: data.strengths || data.areas_of_strength || data.assessment?.areas_of_strength || data.pros || [],
    weaknesses: data.weaknesses || data.areas_for_improvement || data.areas_of_improvement || data.weak_points || data.assessment?.weaknesses || data.cons || [],
    missing_keywords: data.missing_keywords || data.keywords_to_add || data.missing_terms || [],
    suggestions: data.suggestions || data.suggestions_for_improvement || data.recommendations || data.steps_to_improve || data.tips || data.assessment?.suggestions_for_improvement || []
  };

  // Ensure arrays
  if (typeof result.strengths === 'string') result.strengths = [result.strengths];
  if (typeof result.weaknesses === 'string') result.weaknesses = [result.weaknesses];
  if (typeof result.suggestions === 'string') result.suggestions = [result.suggestions];

  // If score is a nested object or string, try to force it to a number
  if (typeof result.score !== 'number') {
    result.score = parseInt(result.score) || 70;
  }

  return result;
}

async function callGemini(systemPrompt, userPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      systemInstruction: systemPrompt,
      contents: [{ role: "user", parts: [{ text: userPrompt + "\n\nREQUIRED: RETURN ONLY JSON." }] }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    try {
      const rawData = robustJsonParse(response.text);
      return mapFields(rawData);
    } catch (e) {
      console.error('Robust Parse Failed. Raw:', response.text);
      throw new Error('AI response format error. Please try again.');
    }
  } catch (error) {
    console.error('Gemini SDK Error:', error);
    throw new Error(error.message || 'AI service error');
  }
}

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const systemPrompt = `You are a recruitment expert. Analyze the resume and provide a JSON response.
EXACT JSON KEYS REQUIRED (Do not rename them):
- "score": 0-100
- "strengths": ["string"]
- "weaknesses": ["string"]
- "missing_keywords": ["string"]
- "suggestions": ["string"]

Respond ONLY with the JSON.`;
    const result = await callGemini(systemPrompt, `Analyze this resume:\n${resumeText}`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    const systemPrompt = `Evaluate the interview answer for a ${role} role. Return JSON.
Schema: { "score": 1-10, "strengths": [], "mistakes": [], "improvements": [] }`;
    const result = await callGemini(systemPrompt, `Q: ${question}\nA: ${answer}`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
