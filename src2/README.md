# AI Resume Screener & Interview Bot

A modern React application that helps streamline the hiring process by automatically screening resumes and conducting AI-powered interviews.

## Features

- 📄 Resume Upload: Drag and drop interface for uploading PDF resumes
- 🔍 Resume Analysis: AI-powered analysis of skills, experience, and qualifications
- 💬 AI Interview: Interactive chat interface for conducting automated interviews
- 📱 Responsive Design: Fully responsive UI that works on desktop and mobile devices

## Tech Stack

- React 18
- Vite
- Modern CSS (with CSS Variables)
- Component-based Architecture

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-screener
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
│── components/       # Reusable UI Components
│   ├── ResumeUpload.jsx
│   ├── ResumeAnalysis.jsx
│   └── InterviewChat.jsx
│── styles/          # Component-specific CSS
│   ├── global.css
│   ├── App.css
│   ├── ResumeUpload.css
│   ├── ResumeAnalysis.css
│   └── InterviewChat.css
│── assets/          # Images, icons, etc.
└── App.jsx          # Main application component
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 