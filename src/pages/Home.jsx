import { Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Transform Your Hiring Process with AI
          </h1>
          <p className="hero-description">
            Our AI-powered resume screening and interview platform helps you find the perfect candidates faster and more efficiently than ever before.
          </p>
          <div className="hero-cta">
            <Link to="/upload" className="cta-button">
              Get Started
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
          </div>
          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">📄</div>
              <h3>Smart Resume Analysis</h3>
              <p>AI-powered resume parsing and skill matching</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3>AI Interviews</h3>
              <p>Automated interviews with natural conversation</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Comprehensive reports and insights</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Resume</h3>
              <p>Upload your resume in PDF or DOCX format</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes skills and experience</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Virtual Interview</h3>
              <p>Complete an AI-powered interview</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Results</h3>
              <p>Receive detailed feedback and insights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 