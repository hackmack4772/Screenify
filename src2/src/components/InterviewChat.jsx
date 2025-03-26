import { useState, useRef, useEffect } from 'react'
import '../styles/InterviewChat.css'

function InterviewChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI interviewer today. Based on your resume, I'd like to ask you a few questions about your experience. Are you ready to begin?"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input.trim()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: generateBotResponse(input.trim())
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput) => {
    // In a real app, this would call your AI backend
    const responses = [
      "That's interesting! Could you tell me more about how you handled challenges in that situation?",
      "Great answer! Now, let me ask you about your experience with team collaboration.",
      "I see. How do you typically approach problem-solving in your work?",
      "Could you provide a specific example of a project where you demonstrated leadership?",
      "Thank you for sharing that. How do you stay updated with industry trends?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="interview-chat">
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === 'bot' && (
                <div className="avatar">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot">
            <div className="message-content">
              <div className="avatar">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M22 2L11 13"/>
            <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>
    </div>
  )
}

export default InterviewChat 