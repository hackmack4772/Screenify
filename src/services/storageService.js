const STORAGE_KEYS = {
  RESUMES: 'resume_screener_resumes',
  INTERVIEWS: 'resume_screener_interviews',
  USER_PREFERENCES: 'resume_screener_preferences'
};

export const storageService = {
  // Resume storage methods
  saveResume(resumeData) {
    try {
      const resumes = this.getResumes();
      resumes.push({
        ...resumeData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
      return true;
    } catch (error) {
      console.error('Error saving resume:', error);
      return false;
    }
  },

  getResumes() {
    try {
      const resumes = localStorage.getItem(STORAGE_KEYS.RESUMES);
      return resumes ? JSON.parse(resumes) : [];
    } catch (error) {
      console.error('Error getting resumes:', error);
      return [];
    }
  },

  getResumeById(id) {
    try {
      const resumes = this.getResumes();
      return resumes.find(resume => resume.id === id);
    } catch (error) {
      console.error('Error getting resume by id:', error);
      return null;
    }
  },

  deleteResume(id) {
    try {
      const resumes = this.getResumes();
      const filteredResumes = resumes.filter(resume => resume.id !== id);
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(filteredResumes));
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  },

  // Interview storage methods
  saveInterview(interviewData) {
    try {
      const interviews = this.getInterviews();
      interviews.push({
        ...interviewData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      return true;
    } catch (error) {
      console.error('Error saving interview:', error);
      return false;
    }
  },

  getInterviews() {
    try {
      const interviews = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return interviews ? JSON.parse(interviews) : [];
    } catch (error) {
      console.error('Error getting interviews:', error);
      return [];
    }
  },

  getInterviewById(id) {
    try {
      const interviews = this.getInterviews();
      return interviews.find(interview => interview.id === id);
    } catch (error) {
      console.error('Error getting interview by id:', error);
      return null;
    }
  },

  deleteInterview(id) {
    try {
      const interviews = this.getInterviews();
      const filteredInterviews = interviews.filter(interview => interview.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(filteredInterviews));
      return true;
    } catch (error) {
      console.error('Error deleting interview:', error);
      return false;
    }
  },

  // User preferences methods
  saveUserPreferences(preferences) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  },

  getUserPreferences() {
    try {
      const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
        theme: 'light',
        language: 'en',
        notifications: true,
        autoSave: true
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        theme: 'light',
        language: 'en',
        notifications: true,
        autoSave: true
      };
    }
  },

  // Analytics methods
  getAnalytics() {
    try {
      const resumes = this.getResumes();
      const interviews = this.getInterviews();

      return {
        totalResumes: resumes.length,
        totalInterviews: interviews.length,
        averageResumeScore: this.calculateAverageScore(resumes),
        averageInterviewScore: this.calculateAverageScore(interviews),
        recentActivity: this.getRecentActivity(resumes, interviews)
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalResumes: 0,
        totalInterviews: 0,
        averageResumeScore: 0,
        averageInterviewScore: 0,
        recentActivity: []
      };
    }
  },

  // Helper methods
  calculateAverageScore(items) {
    if (!items.length) return 0;
    const totalScore = items.reduce((sum, item) => sum + (item.score || 0), 0);
    return Math.round(totalScore / items.length);
  },

  getRecentActivity(resumes, interviews) {
    const allItems = [
      ...resumes.map(resume => ({ ...resume, type: 'resume' })),
      ...interviews.map(interview => ({ ...interview, type: 'interview' }))
    ];

    return allItems
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  },

  // Cleanup method
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}; 