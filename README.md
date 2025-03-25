# Automated Resume Screener & AI Interview Bot

A modern web application that helps streamline the resume screening and interview process using AI technology.

## Features

### Resume Upload & Parsing
- Upload PDF and DOCX resumes
- Automatic parsing of key information
- PDF preview with zoom and rotation
- File validation and error handling

### AI-Powered Resume Analysis
- DeepSeek API integration for intelligent analysis
- Key information extraction
- Skills assessment
- Experience evaluation
- Improvement suggestions

### Automated AI Interview Bot
- Dynamic question generation based on resume
- Real-time answer evaluation
- Constructive feedback
- Progress tracking
- Score calculation

### User Dashboard
- Analytics overview
- Performance metrics
- Recent activity tracking
- Resume and interview history
- Data visualization

## Tech Stack

- React 19
- Vite
- React Router
- PDF.js
- Chart.js
- DeepSeek API
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- DeepSeek API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-screener.git
cd resume-screener
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your DeepSeek API key:
```env
VITE_DEEPSEEK_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
resume-screener/
├── src/
│   ├── components/
│   │   ├── ResumeUpload.jsx
│   │   ├── ResumeAnalysis.jsx
│   │   ├── InterviewChat.jsx
│   │   ├── Dashboard.jsx
│   │   └── Navigation.jsx
│   ├── services/
│   │   ├── resumeService.js
│   │   ├── interviewService.js
│   │   └── storageService.js
│   ├── styles/
│   │   ├── ResumeUpload.css
│   │   ├── ResumeAnalysis.css
│   │   ├── InterviewChat.css
│   │   ├── Dashboard.css
│   │   └── Navigation.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- DeepSeek API for AI capabilities
- React team for the amazing framework
- All contributors and users of this project
