import '../styles/About.css'

function About() {
  const faqs = [
    {
      question: "How does the AI resume screening work?",
      answer: "Our AI analyzes your resume using advanced natural language processing to extract skills, experience, and qualifications. It then matches these against job requirements to provide a comprehensive analysis."
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, we support PDF and DOCX file formats for resume uploads. We recommend using PDF for the best results."
    },
    {
      question: "How accurate is the AI interview assessment?",
      answer: "Our AI interview system has been trained on thousands of real interviews and provides highly accurate assessments. However, it should be used as a complementary tool alongside human judgment."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All uploaded resumes and interview data are encrypted and stored securely. We never share your personal information with third parties."
    }
  ]

  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1>About AI Resume Screener</h1>
          <p>Transforming the hiring process with artificial intelligence</p>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Matching</h3>
              <p>Advanced AI algorithms match candidates to job requirements with high accuracy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>Get instant resume analysis and interview feedback</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Interviews</h3>
              <p>Conduct automated interviews with natural conversation flow</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Reports</h3>
              <p>Comprehensive analytics and insights for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="process">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Resume</h3>
                <p>Upload your resume in PDF or DOCX format through our secure platform</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our AI analyzes the resume content and extracts relevant information</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Interview</h3>
                <p>Complete an AI-powered interview based on your resume</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get Results</h3>
                <p>Receive detailed feedback and analytics about your candidacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>Have questions? We're here to help!</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong>
              <a href="mailto:support@aiscreener.com">support@aiscreener.com</a>
            </div>
            <div className="contact-item">
              <strong>Phone:</strong>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 