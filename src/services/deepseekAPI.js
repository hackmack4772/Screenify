import axios from 'axios';

class DeepSeekAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async analyzeResume(resumeData) {
    try {
      const response = await this.client.post('/resume/analyze', resumeData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  async generateSuggestions(resumeData) {
    try {
      const response = await this.client.post('/resume/suggestions', resumeData);
      return response.data;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  async getTemplates() {
    try {
      const response = await this.client.get('/resume/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }

  async getTemplateById(templateId) {
    try {
      const response = await this.client.get(`/resume/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw new Error('Failed to fetch template');
    }
  }

  // Mock methods for development (when API is not available)
  async mockAnalyzeResume(resumeData) {
    return {
      score: 85,
      completeness: 90,
      missingSections: ['Certifications'],
      recommendations: [
        'Add more quantifiable achievements in work experience',
        'Include relevant certifications',
        'Expand on technical skills'
      ]
    };
  }

  async mockGetTemplates() {
    return {
      'modern': {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean and contemporary design',
        defaultFont: 'Inter',
        defaultColors: {
          primary: '#2563eb',
          secondary: '#64748b',
          background: '#ffffff',
          text: '#1e293b'
        },
        sections: [
          { id: 'personal', title: 'Personal Information', required: true },
          { id: 'experience', title: 'Work Experience', required: true },
          { id: 'education', title: 'Education', required: true },
          { id: 'skills', title: 'Skills', required: true },
          { id: 'projects', title: 'Projects', required: false },
          { id: 'certifications', title: 'Certifications', required: false },
          { id: 'languages', title: 'Languages', required: false },
          { id: 'interests', title: 'Interests', required: false }
        ]
      },
      'minimal': {
        id: 'minimal',
        name: 'Minimal Classic',
        description: 'Simple and elegant layout',
        defaultFont: 'Source Sans Pro',
        defaultColors: {
          primary: '#0f172a',
          secondary: '#475569',
          background: '#ffffff',
          text: '#1e293b'
        },
        sections: [
          { id: 'personal', title: 'Personal Information', required: true },
          { id: 'experience', title: 'Work Experience', required: true },
          { id: 'education', title: 'Education', required: true },
          { id: 'skills', title: 'Skills', required: true },
          { id: 'projects', title: 'Projects', required: false },
          { id: 'languages', title: 'Languages', required: false }
        ]
      }
    };
  }

  async mockGetTemplateById(templateId) {
    const templates = await this.mockGetTemplates();
    return templates[templateId] || null;
  }
}

// Create and export a singleton instance
export const deepseekAPI = new DeepSeekAPI(); 