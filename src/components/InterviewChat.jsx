import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { interviewService } from '../services/interviewService';
import { storageService } from '../services/storageService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import '../styles/InterviewChat.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InterviewChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewScore, setInterviewScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [interviewContext, setInterviewContext] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState(null);
  const [followUpQuestion, setFollowUpQuestion] = useState(null);
  const messagesEndRef = useRef(null);
  const [showPersonalityInsights, setShowPersonalityInsights] = useState(false);
  const [showSentimentAnalysis, setShowSentimentAnalysis] = useState(false);
  const [showEmotionalIntelligence, setShowEmotionalIntelligence] = useState(false);
  const [showCareerTrajectory, setShowCareerTrajectory] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [answerQuality, setAnswerQuality] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeTemplate, setCodeTemplate] = useState('');
  const [showTechnicalInsights, setShowTechnicalInsights] = useState(false);
  const [showLearningCurve, setShowLearningCurve] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    voiceInput: false
  });

  useEffect(() => {
    // Load the most recent resume data
    const resumes = storageService.getResumes();
    if (resumes.length > 0) {
      setResumeData(resumes[resumes.length - 1].parsedData);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Calculate typing speed
    if (userAnswer) {
      const words = userAnswer.trim().split(/\s+/).length;
      const timeElapsed = (Date.now() - startTime) / 1000; // in seconds
      setTypingSpeed(words / timeElapsed);
    }
  }, [userAnswer]);

  useEffect(() => {
    if (accessibilitySettings.voiceInput) {
      initializeVoiceRecognition();
    }
  }, [accessibilitySettings.voiceInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startInterview = async () => {
    if (!resumeData) {
      toast.error('Please upload a resume first');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize interview with AI analysis
      const { context, firstQuestion } = await interviewService.initializeInterview(resumeData);
      setInterviewContext(context);
      setCurrentQuestion(firstQuestion);
      
      setMessages([
        {
          type: 'system',
          content: `Hello! I'm your AI interviewer. I'll be conducting a ${context.difficulty} level interview focusing on ${context.focus.join(', ')}. Please provide detailed answers.`
        },
        {
          type: 'question',
          content: firstQuestion.text
        }
      ]);
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.warning('Please provide an answer');
      return;
    }

    setIsLoading(true);
    try {
      // Add user's answer to messages
      setMessages(prev => [
        ...prev,
        { type: 'answer', content: userAnswer }
      ]);

      // Evaluate the answer
      const evaluation = await interviewService.evaluateAnswer(
        currentQuestion.text,
        userAnswer,
        resumeData
      );

      // Update feedback and score
      setFeedback(evaluation);
      setInterviewScore(prev => Math.round((prev + evaluation.score) / 2));
      setShowFeedback(true);
      setActiveTab('feedback');

      // Analyze answer quality
      const quality = calculateAnswerQuality(evaluation);
      setAnswerQuality(quality);

      // Clear input
      setUserAnswer('');

      // Save interview progress
      storageService.saveInterview({
        question: currentQuestion.text,
        answer: userAnswer,
        evaluation,
        timestamp: new Date().toISOString(),
        typingSpeed,
        answerQuality
      });

      // Move to next question after a delay
      setTimeout(async () => {
        setShowFeedback(false);
        setFeedback(null);
        
        // Get next question
        const nextQuestion = await interviewService.generateNextQuestion();
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
          setMessages(prev => [
            ...prev,
            { type: 'question', content: nextQuestion.text }
          ]);
        } else {
          // Interview complete
          const summary = await interviewService.generateInterviewSummary();
          setInterviewSummary(summary);
          setShowSummary(true);
        }
      }, 5000);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast.error('Failed to evaluate answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnswerQuality = (evaluation) => {
    const { score, clarityOfExplanation, problemSolvingApproach, confidenceLevel } = evaluation;
    let quality = 'good';

    if (score >= 90 && clarityOfExplanation === 'excellent' && confidenceLevel === 'high') {
      quality = 'excellent';
    } else if (score < 70 || clarityOfExplanation === 'poor' || confidenceLevel === 'low') {
      quality = 'needs-improvement';
    }

    return quality;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    } else if (e.key === 'Escape') {
      setShowKeyboardShortcuts(false);
    } else if (e.key === 'h' && e.ctrlKey) {
      e.preventDefault();
      setHighContrastMode(!highContrastMode);
    } else if (e.key === '+' && e.ctrlKey) {
      e.preventDefault();
      setFontSize(prev => Math.min(prev + 2, 24));
    } else if (e.key === '-' && e.ctrlKey) {
      e.preventDefault();
      setFontSize(prev => Math.max(prev - 2, 12));
    }
  };

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setVoiceInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition error. Please try again.');
      };

      return recognition;
    }
    return null;
  };

  const toggleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      const recognition = initializeVoiceRecognition();
      if (recognition) {
        recognition.start();
      }
    }
  };

  const startPracticeMode = async () => {
    setPracticeMode(true);
    // Generate practice questions based on resume
    const practiceQuestions = await interviewService.generatePracticeQuestions(resumeData);
    setQuestionBank(practiceQuestions);
    setCurrentQuestion(practiceQuestions[0]);
  };

  const renderTechnicalInsights = () => {
    if (!feedback?.technicalDepth) return null;

    return (
      <div className="technical-insights">
        <h4>Technical Analysis</h4>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-label">Complexity Level</span>
            <div className="complexity-meter">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`complexity-bar ${i < feedback.technicalDepth.complexityLevel ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-label">System Design</span>
            <span className="insight-value">{feedback.technicalDepth.systemDesignAwareness}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Scalability</span>
            <span className="insight-value">{feedback.technicalDepth.scalabilityKnowledge}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Performance</span>
            <span className="insight-value">{feedback.technicalDepth.performanceOptimization}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLearningCurve = () => {
    if (!interviewContext?.learningCurve?.progression.length) return null;

    const data = interviewContext.learningCurve.progression.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      score: point.score,
      improvement: point.improvement
    }));

    return (
      <div className="learning-curve">
        <h4>Learning Progress</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2ecc71" />
            <Line type="monotone" dataKey="improvement" stroke="#3498db" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAccessibilityMenu = () => (
    <div className="accessibility-menu">
      <h4>Accessibility Settings</h4>
      <div className="accessibility-options">
        <label className="accessibility-option">
          <input
            type="checkbox"
            checked={accessibilitySettings.highContrast}
            onChange={(e) => setAccessibilitySettings(prev => ({
              ...prev,
              highContrast: e.target.checked
            }))}
          />
          High Contrast Mode
        </label>
        <label className="accessibility-option">
          <input
            type="checkbox"
            checked={accessibilitySettings.largeText}
            onChange={(e) => setAccessibilitySettings(prev => ({
              ...prev,
              largeText: e.target.checked
            }))}
          />
          Large Text
        </label>
        <label className="accessibility-option">
          <input
            type="checkbox"
            checked={accessibilitySettings.reducedMotion}
            onChange={(e) => setAccessibilitySettings(prev => ({
              ...prev,
              reducedMotion: e.target.checked
            }))}
          />
          Reduced Motion
        </label>
        <label className="accessibility-option">
          <input
            type="checkbox"
            checked={accessibilitySettings.screenReader}
            onChange={(e) => setAccessibilitySettings(prev => ({
              ...prev,
              screenReader: e.target.checked
            }))}
          />
          Screen Reader Support
        </label>
        <label className="accessibility-option">
          <input
            type="checkbox"
            checked={accessibilitySettings.voiceInput}
            onChange={(e) => setAccessibilitySettings(prev => ({
              ...prev,
              voiceInput: e.target.checked
            }))}
          />
          Voice Input
        </label>
      </div>
    </div>
  );

  const renderTechnicalExpertise = () => {
    if (!feedback?.technicalDepth?.expertise) return null;

    const data = Object.entries(feedback.technicalDepth.expertise).map(([key, value]) => ({
      skill: key,
      value: value
    }));

    return (
      <div className="technical-expertise">
        <h4>Technical Expertise</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 5]} />
            <Radar
              name="Expertise"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderCodeQualityMetrics = () => {
    if (!feedback?.codeQuality) return null;

    const complexityData = Object.entries(feedback.codeQuality.complexity).map(([key, value]) => ({
      name: key,
      value: value
    }));

    const performanceData = Object.entries(feedback.codeQuality.performance).map(([key, value]) => ({
      name: key,
      value: value
    }));

    return (
      <div className="code-quality-metrics">
        <h4>Code Quality Analysis</h4>
        <div className="metrics-grid">
          <div className="metric-chart">
            <h5>Complexity Metrics</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-chart">
            <h5>Performance Analysis</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={performanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderLearningProgress = () => {
    if (!interviewContext?.learningCurve) return null;

    const skillData = Object.entries(interviewContext.learningCurve.skillAcquisition).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString(),
      score: data.score,
      potential: data.potential,
      improvement: data.improvement
    }));

    return (
      <div className="learning-progress">
        <h4>Learning Progress</h4>
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Knowledge Retention</span>
            <span className="stat-value">{interviewContext.learningCurve.knowledgeRetention.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Problem-Solving Growth</span>
            <span className="stat-value">{interviewContext.learningCurve.problemSolvingGrowth}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skillData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
            <Line type="monotone" dataKey="potential" stroke="#82ca9d" name="Potential" />
            <Line type="monotone" dataKey="improvement" stroke="#ffc658" name="Improvement" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPracticeMode = () => {
    if (!practiceMode) return null;

    return (
      <div className="practice-mode">
        <div className="practice-mode-header">
          <h4>Practice Mode</h4>
          <button
            className="close-btn"
            onClick={() => setPracticeMode(false)}
            aria-label="Close practice mode"
          >
            ×
          </button>
        </div>
        <div className="practice-stats">
          <div className="practice-stat-item">
            <span className="stat-label">Questions Completed</span>
            <span className="stat-value">{questionBank.length}</span>
          </div>
          <div className="practice-stat-item">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{interviewScore}%</span>
          </div>
          <div className="practice-stat-item">
            <span className="stat-label">Time Spent</span>
            <span className="stat-value">{formatTimeSpent()}</span>
          </div>
        </div>
        <div className="practice-controls">
          <button
            className="control-btn"
            onClick={() => setShowTimer(!showTimer)}
            aria-label="Toggle timer"
          >
            ⏱️
          </button>
          <button
            className="control-btn"
            onClick={() => setShowHints(!showHints)}
            aria-label="Toggle hints"
          >
            💡
          </button>
          <button
            className="control-btn"
            onClick={() => setShowSolution(!showSolution)}
            aria-label="Toggle solution"
          >
            ✅
          </button>
        </div>
      </div>
    );
  };

  const renderAccessibilityFeatures = () => {
    return (
      <div className="accessibility-features">
        <div className="accessibility-controls">
          <button
            className="control-btn"
            onClick={() => setHighContrastMode(!highContrastMode)}
            aria-label="Toggle high contrast mode"
          >
            {highContrastMode ? '☀️' : '🌙'}
          </button>
          <button
            className="control-btn"
            onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
            aria-label="Increase font size"
          >
            A+
          </button>
          <button
            className="control-btn"
            onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <button
            className="control-btn"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            aria-label="Show keyboard shortcuts"
          >
            ⌨️
          </button>
          <button
            className="control-btn"
            onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
            aria-label="Toggle accessibility menu"
          >
            ♿
          </button>
        </div>
        {showAccessibilityMenu && (
          <div className="accessibility-menu">
            <h4>Accessibility Settings</h4>
            <div className="accessibility-options">
              <label className="accessibility-option">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.highContrast}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    highContrast: e.target.checked
                  }))}
                />
                High Contrast Mode
              </label>
              <label className="accessibility-option">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.largeText}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    largeText: e.target.checked
                  }))}
                />
                Large Text
              </label>
              <label className="accessibility-option">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.reducedMotion}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    reducedMotion: e.target.checked
                  }))}
                />
                Reduced Motion
              </label>
              <label className="accessibility-option">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.screenReader}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    screenReader: e.target.checked
                  }))}
                />
                Screen Reader Support
              </label>
              <label className="accessibility-option">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.voiceInput}
                  onChange={(e) => setAccessibilitySettings(prev => ({
                    ...prev,
                    voiceInput: e.target.checked
                  }))}
                />
                Voice Input
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`interview-chat-container ${accessibilitySettings.highContrast ? 'high-contrast' : ''}`}>
      <div className="interview-header">
        <h2>AI Interview Session</h2>
        <div className="interview-controls">
          <button
            className="control-btn"
            onClick={() => setHighContrastMode(!highContrastMode)}
            aria-label="Toggle high contrast mode"
          >
            {highContrastMode ? '☀️' : '🌙'}
          </button>
          <button
            className="control-btn"
            onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
            aria-label="Increase font size"
          >
            A+
          </button>
          <button
            className="control-btn"
            onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <button
            className="control-btn"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            aria-label="Show keyboard shortcuts"
          >
            ⌨️
          </button>
          <button
            className="control-btn"
            onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
            aria-label="Toggle accessibility menu"
          >
            ♿
          </button>
          <button
            className="control-btn"
            onClick={() => setShowVisualizations(!showVisualizations)}
            aria-label="Toggle visualizations"
          >
            📊
          </button>
          <button
            className="control-btn"
            onClick={() => setPracticeMode(!practiceMode)}
            aria-label="Toggle practice mode"
          >
            🎯
          </button>
        </div>
        {interviewContext && (
          <div className="interview-context">
            <span className="difficulty-badge">{interviewContext.difficulty}</span>
            <span className="focus-badges">
              {interviewContext.focus.map(focus => (
                <span key={focus} className="focus-badge">{focus}</span>
              ))}
            </span>
          </div>
        )}
        {!currentQuestion && (
          <button
            className="start-interview-btn"
            onClick={startInterview}
            disabled={isLoading || !resumeData}
          >
            {isLoading ? 'Starting...' : 'Start Interview'}
          </button>
        )}
      </div>

      {showKeyboardShortcuts && (
        <div className="keyboard-shortcuts">
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><kbd>Enter</kbd> - Submit answer</li>
            <li><kbd>Ctrl</kbd> + <kbd>H</kbd> - Toggle high contrast</li>
            <li><kbd>Ctrl</kbd> + <kbd>+</kbd> - Increase font size</li>
            <li><kbd>Ctrl</kbd> + <kbd>-</kbd> - Decrease font size</li>
            <li><kbd>Esc</kbd> - Close this panel</li>
          </ul>
        </div>
      )}

      {showAccessibilityMenu && renderAccessibilityMenu()}

      {showVisualizations && (
        <div className="visualizations-container">
          {renderTechnicalExpertise()}
          {renderCodeQualityMetrics()}
          {renderLearningProgress()}
        </div>
      )}

      <div className="chat-messages" style={{ fontSize: `${fontSize}px` }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type}`}
          >
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentQuestion && (
        <div className="chat-input-container">
          {accessibilitySettings.voiceInput && (
            <button
              className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleVoiceInput}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              🎤
            </button>
          )}
          <div className="input-stats">
            <span>Words: {userAnswer.trim().split(/\s+/).length}</span>
            <span>Speed: {typingSpeed.toFixed(1)} wpm</span>
          </div>
          <textarea
            value={voiceInput || userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            disabled={isLoading || showFeedback}
            style={{
              fontSize: accessibilitySettings.largeText ? '18px' : '16px'
            }}
          />
          <button
            className="submit-btn"
            onClick={submitAnswer}
            disabled={isLoading || showFeedback || !userAnswer.trim()}
          >
            {isLoading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </div>
      )}

      {showFeedback && feedback && (
        <div className="feedback-container">
          <div className="feedback-tabs">
            <button
              className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
            <button
              className={`tab-btn ${activeTab === 'personality' ? 'active' : ''}`}
              onClick={() => setActiveTab('personality')}
            >
              Personality Insights
            </button>
            <button
              className={`tab-btn ${activeTab === 'sentiment' ? 'active' : ''}`}
              onClick={() => setActiveTab('sentiment')}
            >
              Sentiment Analysis
            </button>
          </div>

          <div className="feedback-content">
            {activeTab === 'feedback' && (
              <>
                <div className="score-section">
                  <h4>Score: {feedback.score}%</h4>
                  <div className={`quality-indicator ${answerQuality}`}>
                    {answerQuality === 'excellent' ? '🌟' : answerQuality === 'good' ? '👍' : '📝'}
                  </div>
                </div>
                <div className="feedback-section">
                  <h4>Feedback</h4>
                  <p>{feedback.feedback}</p>
                </div>
                <div className="suggestions-section">
                  <h4>Suggestions for Improvement</h4>
                  <ul>
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="strengths-section">
                  <h4>Strengths</h4>
                  <ul>
                    {feedback.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="improvements-section">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    {feedback.areasForImprovement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'personality' && feedback.personalityInsights && (
              <div className="personality-insights">
                <h4>Personality Insights</h4>
                <div className="insights-grid">
                  <div className="insight-item">
                    <span className="insight-label">Communication Style</span>
                    <span className="insight-value">{feedback.personalityInsights.communicationStyle}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Problem-Solving</span>
                    <span className="insight-value">{feedback.personalityInsights.problemSolvingApproach}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Leadership</span>
                    <span className="insight-value">{feedback.personalityInsights.leadershipPotential}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Team Collaboration</span>
                    <span className="insight-value">{feedback.personalityInsights.teamCollaborationStyle}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Adaptability</span>
                    <span className="insight-value">{feedback.personalityInsights.adaptabilityLevel}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sentiment' && feedback.sentiment && (
              <div className="sentiment-analysis">
                <h4>Sentiment Analysis</h4>
                <div className="sentiment-grid">
                  <div className="sentiment-item">
                    <span className="sentiment-label">Overall Sentiment</span>
                    <span className={`sentiment-value ${feedback.sentiment.overallSentiment}`}>
                      {feedback.sentiment.overallSentiment}
                    </span>
                  </div>
                  <div className="sentiment-item">
                    <span className="sentiment-label">Confidence</span>
                    <span className="sentiment-value">{feedback.sentiment.confidence}%</span>
                  </div>
                  <div className="sentiment-item">
                    <span className="sentiment-label">Stress Level</span>
                    <span className={`sentiment-value ${feedback.sentiment.stressLevel}`}>
                      {feedback.sentiment.stressLevel}
                    </span>
                  </div>
                  <div className="sentiment-item">
                    <span className="sentiment-label">Engagement</span>
                    <span className={`sentiment-value ${feedback.sentiment.engagementLevel}`}>
                      {feedback.sentiment.engagementLevel}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSummary && interviewSummary && (
        <div className="summary-container">
          <h3>Interview Summary</h3>
          <div className="summary-content">
            <div className="overall-assessment">
              <h4>Overall Assessment</h4>
              <p>{interviewSummary.overallAssessment}</p>
            </div>
            <div className="key-strengths">
              <h4>Key Strengths</h4>
              <ul>
                {interviewSummary.keyStrengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="improvement-areas">
              <h4>Areas for Improvement</h4>
              <ul>
                {interviewSummary.improvementAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
            <div className="technical-evaluation">
              <h4>Technical Competency</h4>
              <p>{interviewSummary.technicalEvaluation}</p>
            </div>
            <div className="communication-assessment">
              <h4>Communication Skills</h4>
              <p>{interviewSummary.communicationAssessment}</p>
            </div>
            <div className="personality-fit">
              <h4>Personality Fit</h4>
              <p>{interviewSummary.personalityFitAnalysis}</p>
            </div>
            <div className="emotional-intelligence">
              <h4>Emotional Intelligence</h4>
              <p>{interviewSummary.emotionalIntelligenceAssessment}</p>
            </div>
            <div className="leadership-potential">
              <h4>Leadership Potential</h4>
              <p>{interviewSummary.leadershipPotential}</p>
            </div>
            <div className="team-collaboration">
              <h4>Team Collaboration</h4>
              <p>{interviewSummary.teamCollaborationStyle}</p>
            </div>
            <div className="recommendations">
              <h4>Recommendations</h4>
              <ul>
                {interviewSummary.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="development-plan">
              <h4>Learning & Development Plan</h4>
              <p>{interviewSummary.learningAndDevelopmentPlan}</p>
            </div>
            <div className="success-metrics">
              <h4>Success Metrics</h4>
              <ul>
                {interviewSummary.successMetrics.map((metric, index) => (
                  <li key={index}>{metric}</li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        )}

      {interviewScore > 0 && (
        <div className="interview-score">
          <h3>Current Interview Score</h3>
          <div className="score-circle">
            {interviewScore}%
          </div>
      </div>
      )}

      {renderPracticeMode()}
      {renderAccessibilityFeatures()}
    </div>
  );
};

export default InterviewChat; 