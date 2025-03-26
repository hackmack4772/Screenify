import { deepseekAPI } from './deepseekAPI';

class ResumeBuilderService {
  constructor() {
    this.storageKey = 'resume_builder_data';
    this.isDevelopment = import.meta.env.MODE === 'development';
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
    try {
      if (this.isDevelopment) {
        return await deepseekAPI.mockGetTemplates();
      }
      return await deepseekAPI.getTemplates();
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  async getTemplateById(templateId) {
    try {
      if (this.isDevelopment) {
        return await deepseekAPI.mockGetTemplateById(templateId);
      }
      return await deepseekAPI.getTemplateById(templateId);
    } catch (error) {
      console.error('Error getting template:', error);
      throw error;
    }
  }

  async createNewResume(templateId) {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      return {
        templateId,
        sections: template.sections.map(section => ({
          ...section,
          enabled: section.required
        })),
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        interests: [],
        customization: {
          font: template.defaultFont,
          colors: template.defaultColors
        }
      };
    } catch (error) {
      console.error('Error creating new resume:', error);
      throw error;
    }
  }

  async saveResume(resumeData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(resumeData));
      return true;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }

  async loadResume() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading resume:', error);
      throw error;
    }
  }

  async analyzeResume(resumeData) {
    try {
      if (this.isDevelopment) {
        return await deepseekAPI.mockAnalyzeResume(resumeData);
      }
      return await deepseekAPI.analyzeResume(resumeData);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
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
    try {
      // For now, just download as JSON
      const blob = new Blob([JSON.stringify(resumeData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      console.error('Error exporting resume:', error);
      throw error;
    }
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