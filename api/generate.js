export default async function handler(req,res){

const { image } = req.body

const prompt = `
You are a thoughtful psychologist examining a patient's drawing.

Interpret emotional patterns, density of strokes, shapes,
and possible psychological meaning.

Speak professionally but conversationally.

Suggest possible emotional states or cognitive tendencies
but do NOT give real medical diagnoses.
`

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=" + process.env.GEMINI_API_KEY,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

contents:[
{
parts:[
{ text: prompt },
{
inlineData:{
mimeType:"image/png",
data:image.split(",")[1]
}
}
]
}
]

})
}
)

const result = await response.json()

res.status(200).json({
text: result.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated."
})

}