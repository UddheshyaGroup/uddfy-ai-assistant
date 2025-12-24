import fetch from "node-fetch"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// ========== AI Homework Assistant ==========
app.post("/api/ask", async (req, res) => {
    const { question } = req.body

    if (!question) {
        return res.status(400).json({ error: "No question provided" })
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                text: `You are a SCHOOL HOMEWORK TUTOR for students (Class 6–12).

STRICT RULES:
- ALWAYS answer ONLY in ENGLISH
- DO NOT use Nepali or any other language
- Use SIMPLE English
- Use short sentences
- No stories
- No unnecessary words
- No complex vocabulary
- No long paragraphs
- Be clear and direct
- Format properly using bullet points or headings

Answer format:
1. One short definition
2. 3–6 bullet points
3. One short conclusion

Now answer this question clearly in ENGLISH:

Question: ${question}`
                                }
                            ]
                        }
                    ]
                })
            }
        )

        const data = await response.json()

        if (!data.candidates) {
            console.log("Gemini Error:", data)
            return res.status(500).json({ error: "AI failed to respond" })
        }

        const answer = data.candidates[0].content.parts[0].text
        res.json({ answer })
    } catch (error) {
        console.error("Server Error:", error)
        res.status(500).json({ error: "Server crashed" })
    }
})

// ========== List Available Gemini Models (Debug Tool) ==========
app.get("/api/models", async (req, res) => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
        )

        const data = await response.json()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ========== Start Server ==========
app.listen(5000, () => {
    console.log("Backend running on port 5000")
})
