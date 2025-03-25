import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './components/Dashboard'
import ResumeUpload from './components/ResumeUpload'
import ResumeAnalysis from './components/ResumeAnalysis'
import InterviewChat from './components/InterviewChat'
import InterestsForm from './components/resume/InterestsForm'
import './styles/global.css'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<ResumeUpload />} />
            <Route path="/analysis" element={<ResumeAnalysis />} />
            <Route path="/interview" element={<InterviewChat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/interests" element={<InterestsForm onSave={() => {}} onCancel={() => {}} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container text-center" style={{ padding: 'var(--spacing-lg) 0' }}>
            <p>© 2024 AI Resume Screener. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App 