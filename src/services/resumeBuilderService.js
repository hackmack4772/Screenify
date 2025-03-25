import { deepseekAPI } from './deepseekAPI';

class ResumeBuilderService {
  constructor() {
    this.templates = {
      softwareEngineer: {
        name: 'Software Engineer',
        sections: [
          { id: 'personal', title: 'Personal Information', required: true },
          { id: 'summary', title: 'Professional Summary', required: true },
          { id: 'experience', title: 'Work Experience', required: true },
          { id: 'education', title: 'Education', required: true },
          { id: 'skills', title: 'Technical Skills', required: true },
          { id: 'projects', title: 'Projects', required: false },
          { id: 'certifications', title: 'Certifications', required: false },
          { id: 'achievements', title: 'Achievements', required: false }
        ],
        defaultFont: 'Roboto',
        defaultColors: {
          primary: '#2c3e50',
          secondary: '#3498db',
          background: '#ffffff',
          text: '#2c3e50'
        }
      },
      dataScientist: {
        name: 'Data Scientist',
        sections: [
          { id: 'personal', title: 'Personal Information', required: true },
          { id: 'summary', title: 'Professional Summary', required: true },
          { id: 'experience', title: 'Work Experience', required: true },
          { id: 'education', title: 'Education', required: true },
          { id: 'skills', title: 'Technical Skills', required: true },
          { id: 'projects', title: 'Data Projects', required: true },
          { id: 'publications', title: 'Publications', required: false },
          { id: 'certifications', title: 'Certifications', required: false }
        ],
        defaultFont: 'Open Sans',
        defaultColors: {
          primary: '#2ecc71',
          secondary: '#27ae60',
          background: '#ffffff',
          text: '#2c3e50'
        }
      },
      marketingManager: {
        name: 'Marketing Manager',
        sections: [
          { id: 'personal', title: 'Personal Information', required: true },
          { id: 'summary', title: 'Professional Summary', required: true },
          { id: 'experience', title: 'Work Experience', required: true },
          { id: 'education', title: 'Education', required: true },
          { id: 'skills', title: 'Marketing Skills', required: true },
          { id: 'campaigns', title: 'Campaign Results', required: true },
          { id: 'achievements', title: 'Achievements', required: true },
          { id: 'certifications', title: 'Certifications', required: false }
        ],
        defaultFont: 'Montserrat',
        defaultColors: {
          primary: '#e74c3c',
          secondary: '#c0392b',
          background: '#ffffff',
          text: '#2c3e50'
        }
      }
    };

    this.defaultResume = {
      personal: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        photo: null
      },
      summary: '',
      experience: [],
      education: [],
      skills: {
        technical: [],
        soft: []
      },
      projects: [],
      certifications: [],
      achievements: [],
      publications: [],
      campaigns: []
    };
  }

  async getTemplates() {
    return this.templates;
  }

  async getTemplateById(templateId) {
    return this.templates[templateId];
  }

  async createNewResume(templateId) {
    const template = await this.getTemplateById(templateId);
    return {
      ...this.defaultResume,
      template: templateId,
      sections: template.sections,
      styling: {
        font: template.defaultFont,
        colors: template.defaultColors
      }
    };
  }

  async analyzeResume(resumeData) {
    const prompt = `
      Analyze the following resume and provide suggestions for improvement:
      ${JSON.stringify(resumeData, null, 2)}

      Please provide:
      1. Content completeness assessment
      2. Missing important sections or information
      3. Grammar and clarity improvements
      4. Industry-specific recommendations
      5. ATS optimization suggestions
      6. Professional tone and language improvements
      7. Achievement quantification opportunities
      8. Skills presentation optimization
      9. Formatting and layout suggestions
      10. Keywords and buzzwords to include
    `;

    const response = await deepseekAPI.generateResponse(prompt);
    return this.parseAnalysisResponse(response);
  }

  async generateResumeSuggestions(resumeData) {
    const prompt = `
      Generate specific suggestions for improving the following resume:
      ${JSON.stringify(resumeData, null, 2)}

      Please provide:
      1. Action verbs to enhance experience descriptions
      2. Quantifiable metrics suggestions
      3. Industry-specific keywords
      4. Skills to highlight
      5. Formatting improvements
      6. Section organization recommendations
      7. Professional summary enhancement
      8. Project description improvements
      9. Achievement presentation suggestions
      10. Education section optimization
    `;

    const response = await deepseekAPI.generateResponse(prompt);
    return this.parseSuggestionsResponse(response);
  }

  async exportResume(resumeData, format) {
    // Implementation for exporting resume in different formats
    // This would typically involve a PDF/DOCX generation library
    return {
      success: true,
      url: 'dummy-url',
      format
    };
  }

  parseAnalysisResponse(response) {
    // Implementation for parsing the analysis response
    return {
      completeness: 0,
      missingSections: [],
      grammarIssues: [],
      recommendations: [],
      atsOptimization: [],
      toneImprovements: [],
      achievementSuggestions: [],
      skillsOptimization: [],
      formattingSuggestions: [],
      keywords: []
    };
  }

  parseSuggestionsResponse(response) {
    // Implementation for parsing the suggestions response
    return {
      actionVerbs: [],
      metrics: [],
      keywords: [],
      skills: [],
      formatting: [],
      organization: [],
      summary: [],
      projects: [],
      achievements: [],
      education: []
    };
  }
}

export const resumeBuilderService = new ResumeBuilderService(); 