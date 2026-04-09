export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

const { image } = req.body

// Temporary test response to confirm API works
// You can later replace this with Gemini API call

return res.status(200).json({
text: "The AI psychologist observes your drawing. The clustered strokes suggest focus and internal processing. This is a placeholder response confirming the API works."
})

}
