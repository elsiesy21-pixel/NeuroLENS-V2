import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const { image } = req.body;

  const prompt = `
    ACT AS: A Clinical Neuropsychologist.
    TASK: Analyze this projective drawing for markers consistent with specific neurological profiles.
    
    STRUCTURE YOUR RESPONSE AS FOLLOWS:
    1. EXECUTIVE FUNCTION: (Analyze stroke patterns/organization)
    2. AFFECTIVE STATE: (Analyze emotional 'vibe' through limbic system lens)
    3. CLINICAL HYPOTHESIS: (Choose one: ADHD-Consistent, Neurotypical, High-Anxiety, or Dissociative. Justify with visual evidence.)
    4. SOMATIC RECOMMENDATION: (One physical exercise to regulate this state).
    
    TONE: Professional, cold, clinical, and data-driven.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
