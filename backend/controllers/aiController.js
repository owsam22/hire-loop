

// Helper to call Gemini API
async function callGemini(systemPrompt, userPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in env vars');
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { 
        maxOutputTokens: 1200, 
        temperature: 0.7,
        responseMimeType: "application/json" // Force JSON
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Gemini API Error:', errorData);
    throw new Error('Failed to fetch from Gemini');
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
  if (!textContent) {
      throw new Error('Empty response from Gemini');
  }

  return JSON.parse(textContent);
}

// @desc    Analyze Resume
// @route   POST /api/ai/resume
// @access  Private/Student
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and tech recruiter.
Analyze the following resume text and respond ONLY with a valid JSON object matching this schema:
{
  "score": <number 0-100 indicating ATS match and overall quality>,
  "strengths": [<array of strings describing 3 key strengths>],
  "weaknesses": [<array of strings describing 2-3 weak points>],
  "missing_keywords": [<array of strings listing important industry keywords missing>],
  "suggestions": [<array of strings providing 3-4 actionable improvements>]
}`;

    const userPrompt = `Resume text:\n${resumeText}\n\nAnalyze this resume.`;
    
    const analysis = await callGemini(systemPrompt, userPrompt);
    res.json(analysis);

  } catch (error) {
    console.error('AI Resume Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate Mock Interview Answer
// @route   POST /api/ai/interview
// @access  Private/Student
export const evaluateInterview = async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const systemPrompt = `You are a Senior Technical Interviewer evaluating a candidate for a ${role || 'Software Engineering'} role.
Evaluate the candidate's answer to the provided question. Respond ONLY with a valid JSON object matching this schema:
{
  "score": <number 1-10 indicating answer quality>,
  "strengths": [<array of strings detailing what they did well>],
  "mistakes": [<array of strings detailing errors or missing components>],
  "improvements": [<array of strings suggesting how to answer better next time>]
}`;

    const userPrompt = `Question: ${question}\nCandidate Answer: ${answer}\n\nEvaluate the response.`;

    const evaluation = await callGemini(systemPrompt, userPrompt);
    res.json(evaluation);

  } catch (error) {
    console.error('AI Interview Error:', error);
    res.status(500).json({ message: error.message });
  }
};
