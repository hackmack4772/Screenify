import { useState } from 'react'
import '../styles/Dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in a real app, this would come from your backend
  const mockData = {
    resumeScore: 85,
    interviewScore: 78,
    skills: [
      { name: 'React', score: 90 },
      { name: 'JavaScript', score: 85 },
      { name: 'Node.js', score: 75 },
      { name: 'Python', score: 70 },
      { name: 'SQL', score: 80 }
    ],
    jobRecommendations: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Corp',
        matchScore: 92,
        location: 'Remote'
      },
      {
        title: 'Full Stack Engineer',
        company: 'StartUp Inc',
        matchScore: 88,
        location: 'New York, NY'
      },
      {
        title: 'React Developer',
        company: 'Digital Solutions',
        matchScore: 85,
        location: 'San Francisco, CA'
      }
    ],
    interviewFeedback: {
      strengths: [
        'Strong problem-solving skills',
        'Excellent communication',
        'Deep technical knowledge'
      ],
      improvements: [
        'Could provide more specific examples',
        'Consider expanding system design knowledge'
      ]
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>Candidate Dashboard</h1>
          <button className="download-btn">
            Download Report
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </header>

        <div className="score-cards">
          <div className="score-card">
            <h3>Resume Match Score</h3>
            <div className="score-circle">
              <span className="score-number">{mockData.resumeScore}</span>
              <span className="score-percent">%</span>
            </div>
          </div>
          <div className="score-card">
            <h3>Interview Score</h3>
            <div className="score-circle">
              <span className="score-number">{mockData.interviewScore}</span>
              <span className="score-percent">%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Matches
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="feedback-section">
                <h3>Interview Feedback</h3>
                <div className="feedback-grid">
                  <div className="feedback-card">
                    <h4>Strengths</h4>
                    <ul>
                      {mockData.interviewFeedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="feedback-card">
                    <h4>Areas for Improvement</h4>
                    <ul>
                      {mockData.interviewFeedback.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-tab">
              <div className="skills-grid">
                {mockData.skills.map((skill, index) => (
                  <div key={index} className="skill-card">
                    <div className="skill-header">
                      <h4>{skill.name}</h4>
                      <span className="skill-score">{skill.score}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="jobs-tab">
              <div className="jobs-grid">
                {mockData.jobRecommendations.map((job, index) => (
                  <div key={index} className="job-card">
                    <div className="job-match-score">{job.matchScore}% Match</div>
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                    <p className="job-location">{job.location}</p>
                    <button className="apply-btn">Apply Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 