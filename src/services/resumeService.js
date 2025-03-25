import axios from 'axios';

const DEEPSEEK_API_KEY = process.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

export const resumeService = {
  // Parse resume content
  async parseResume(file) {
    try {
      // Convert PDF to text using PDF.js
      const pdf = await pdfjsLib.getDocument(file).promise;
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ');
      }

      // Analyze resume using DeepSeek API
      const analysis = await this.analyzeResume(fullText);
      
      return {
        rawText: fullText,
        analysis,
        parsedData: this.extractStructuredData(fullText)
      };
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to parse resume. Please try again.');
    }
  },

  // Analyze resume using DeepSeek API
  async analyzeResume(text) {
    try {
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are an expert resume analyzer. Analyze the following resume and provide detailed feedback."
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  },

  // Extract structured data from resume text
  extractStructuredData(text) {
    // Basic regex patterns for common resume sections
    const patterns = {
      name: /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m,
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      phone: /(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/,
      skills: /(?:Skills|Technical Skills|Core Competencies):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      experience: /(?:Experience|Work Experience|Professional Experience):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      education: /(?:Education|Academic Background):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i
    };

    const data = {
      name: text.match(patterns.name)?.[1] || '',
      email: text.match(patterns.email)?.[0] || '',
      phone: text.match(patterns.phone)?.[0] || '',
      skills: this.extractList(text.match(patterns.skills)?.[1] || ''),
      experience: this.extractExperience(text.match(patterns.experience)?.[1] || ''),
      education: this.extractEducation(text.match(patterns.education)?.[1] || '')
    };

    return data;
  },

  // Helper function to extract list items
  extractList(text) {
    return text
      .split('\n')
      .map(item => item.trim())
      .filter(item => item && !item.match(/^[•\-*]\s*$/))
      .map(item => item.replace(/^[•\-*]\s*/, ''));
  },

  // Helper function to extract experience entries
  extractExperience(text) {
    const entries = text.split('\n\n');
    return entries.map(entry => {
      const lines = entry.split('\n');
      return {
        title: lines[0]?.trim() || '',
        company: lines[1]?.trim() || '',
        period: lines[2]?.trim() || '',
        description: lines.slice(3).join('\n').trim()
      };
    });
  },

  // Helper function to extract education entries
  extractEducation(text) {
    const entries = text.split('\n\n');
    return entries.map(entry => {
      const lines = entry.split('\n');
      return {
        degree: lines[0]?.trim() || '',
        institution: lines[1]?.trim() || '',
        period: lines[2]?.trim() || '',
        details: lines.slice(3).join('\n').trim()
      };
    });
  }
}; 