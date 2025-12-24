import { useState } from "react"
import ReactMarkdown from "react-markdown"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [displayedAnswer, setDisplayedAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  // Typewriter effect
  const typeWriter = (text) => {
    setDisplayedAnswer("")
    let index = 0

    const interval = setInterval(() => {
      setDisplayedAnswer((prev) => prev + text.charAt(index))
      index++

      if (index >= text.length) {
        clearInterval(interval)
      }
    }, 15) // typing speed
  }

  const askAI = async () => {
    setLoading(true)
    setDisplayedAnswer("")   // clear previous answer

    const res = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    })

    const data = await res.json()
    setAnswer(data.answer)
    typeWriter(data.answer)   // start typing effect
    setLoading(false)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Homework Assistant</h1>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your homework question..."
        style={{ width: "100%", height: 120 }}
      />

      <br /><br />
      <button onClick={askAI}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Answer:</h3>
        <ReactMarkdown>{displayedAnswer}</ReactMarkdown>
      </div>
    </div>
  )
}

export default App
