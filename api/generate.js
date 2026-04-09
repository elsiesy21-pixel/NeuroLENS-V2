import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Setup the AI with your API Key
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { image } = req.body;
  const base64Data = image.split(",")[1]; // Remove the header from the image data

  // 2. The Clinical "System Prompt"
  const prompt = `
    ACT AS: A Clinical Neuropsychologist specializing in projective drawing analysis.
    TASK: Provide a cold, objective, and provocative diagnostic assessment of this drawing.
    
    REQUIRED SECTIONS:
    - EXECUTIVE FUNCTION: Analyze the stroke pressure and spatial placement.
    - AFFECTIVE STATE: Describe the limbic system arousal level.
    - DIAGNOSTIC HYPOTHESIS: You MUST categorize this drawing into one of these specific profiles: 
      [ADHD-Consistent, Psychopathic/Antisocial Markers, High-Anxiety/Hyper-vigilant, or Neurotypical]. 
      Justify your choice with specific visual evidence from the lines.
    - SOMATIC RESET: One physical exercise to regulate this specific state.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "AI Processing Error: " + error.message });
  }
}
