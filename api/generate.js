import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // Safety Check: Is the Vercel API Key set?
    if (!process.env.GOOGLE_AI_API_KEY) {
      return res.status(500).json({ text: "SYSTEM ERROR: Vercel cannot find the GOOGLE_AI_API_KEY environment variable. Add it in Vercel settings." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Safety Check: Did the image arrive?
    const { image } = req.body;
    if (!image) {
       return res.status(500).json({ text: "SYSTEM ERROR: No image data was sent to the server." });
    }

    // Isolate the base64 string from the "dataURL" format
    const base64Data = image.split(",")[1]; 

    // The Clinical Prompt
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

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    res.status(200).json({ text: response.text() });

  } catch (error) {
    // If Google crashes, print the EXACT error message to the screen so we can fix it
    res.status(500).json({ text: "AI CRASH REASON: " + error.message });
  }
}
