import { useState, useEffect } from 'react'
import '../styles/ResumeAnalysis.css'

function ResumeAnalysis({ file, onComplete }) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    // Simulate API call for resume analysis
    const analyzeResume = async () => {
      try {
        // In a real app, you would send the file to your backend here
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock analysis result
        setAnalysis({
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          experience: '5 years',
          education: 'Bachelor in Computer Science',
          matchScore: 85,
          suggestedQuestions: [
            'Tell me about your experience with React',
            'How do you handle state management in large applications?',
            'Describe a challenging project you worked on'
          ]
        })
        setLoading(false)
      } catch (error) {
        console.error('Error analyzing resume:', error)
        setLoading(false)
      }
    }

    analyzeResume()
  }, [file])

  if (loading) {
    return (
      <div className="analysis-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your resume...</p>
      </div>
    )
  }

  return (
    <div className="analysis-results">
      <div className="match-score">
        <div className="score-circle">
          <span className="score-number">{analysis.matchScore}</span>
          <span className="score-percent">%</span>
        </div>
        <p>Match Score</p>
      </div>

      <div className="analysis-section">
        <h3>Key Skills</h3>
        <div className="skills-list">
          {analysis.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="analysis-section">
        <h3>Experience & Education</h3>
        <p><strong>Experience:</strong> {analysis.experience}</p>
        <p><strong>Education:</strong> {analysis.education}</p>
      </div>

      <div className="analysis-section">
        <h3>Suggested Interview Questions</h3>
        <ul className="questions-list">
          {analysis.suggestedQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>

      <button className="start-interview-btn" onClick={onComplete}>
        Start Interview
      </button>
    </div>
  )
}

export default ResumeAnalysis 