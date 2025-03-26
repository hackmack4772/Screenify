class ResumeIntegrationService {
  constructor() {
    this.storageKey = 'resume_data';
  }

  // Save resume data to local storage
  saveResumeData(resumeData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(resumeData));
      return true;
    } catch (error) {
      console.error('Error saving resume data:', error);
      return false;
    }
  }

  // Get resume data from local storage
  getResumeData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting resume data:', error);
      return null;
    }
  }

  // Convert resume builder data to scanner format
  convertToScannerFormat(builderData) {
    return {
      personalInfo: {
        name: builderData.personalInfo?.fullName || '',
        email: builderData.personalInfo?.email || '',
        phone: builderData.personalInfo?.phone || '',
        location: builderData.personalInfo?.location || '',
        linkedin: builderData.personalInfo?.linkedin || '',
        website: builderData.personalInfo?.website || ''
      },
      education: (builderData.education || []).map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.fieldOfStudy,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        honors: edu.honors,
        courses: edu.relevantCoursework
      })),
      experience: (builderData.experience || []).map(exp => ({
        company: exp.company,
        title: exp.title,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.isCurrent,
        description: exp.description,
        achievements: exp.achievements
      })),
      skills: (builderData.skills || []).map(skill => ({
        name: skill.name,
        level: skill.proficiency,
        category: skill.category,
        years: skill.yearsExperience
      })),
      projects: (builderData.projects || []).map(project => ({
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        url: project.url,
        github: project.githubUrl,
        startDate: project.startDate,
        endDate: project.endDate
      })),
      certifications: (builderData.certifications || []).map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.issueDate,
        expiry: cert.expiryDate,
        id: cert.credentialId,
        url: cert.credentialUrl
      })),
      languages: (builderData.languages || []).map(lang => ({
        name: lang.name,
        proficiency: lang.proficiency,
        certificates: lang.certificates
      })),
      interests: (builderData.interests || []).map(interest => ({
        name: interest.name,
        description: interest.description,
        category: interest.category,
        achievements: interest.achievements
      }))
    };
  }

  // Convert scanner format to builder format
  convertToBuilderFormat(scannerData) {
    return {
      personalInfo: {
        fullName: scannerData.personalInfo?.name || '',
        email: scannerData.personalInfo?.email || '',
        phone: scannerData.personalInfo?.phone || '',
        location: scannerData.personalInfo?.location || '',
        linkedin: scannerData.personalInfo?.linkedin || '',
        website: scannerData.personalInfo?.website || ''
      },
      education: (scannerData.education || []).map(edu => ({
        id: Date.now(),
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.field,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        honors: edu.honors,
        relevantCoursework: edu.courses
      })),
      experience: (scannerData.experience || []).map(exp => ({
        id: Date.now(),
        company: exp.company,
        title: exp.title,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.current,
        description: exp.description,
        achievements: exp.achievements
      })),
      skills: (scannerData.skills || []).map(skill => ({
        id: Date.now(),
        name: skill.name,
        proficiency: skill.level,
        category: skill.category,
        yearsExperience: skill.years
      })),
      projects: (scannerData.projects || []).map(project => ({
        id: Date.now(),
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        url: project.url,
        githubUrl: project.github,
        startDate: project.startDate,
        endDate: project.endDate
      })),
      certifications: (scannerData.certifications || []).map(cert => ({
        id: Date.now(),
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.date,
        expiryDate: cert.expiry,
        credentialId: cert.id,
        credentialUrl: cert.url
      })),
      languages: (scannerData.languages || []).map(lang => ({
        id: Date.now(),
        name: lang.name,
        proficiency: lang.proficiency,
        certificates: lang.certificates
      })),
      interests: (scannerData.interests || []).map(interest => ({
        id: Date.now(),
        name: interest.name,
        description: interest.description,
        category: interest.category,
        achievements: interest.achievements
      }))
    };
  }

  // Export resume to PDF format
  async exportToPDF(resumeData) {
    // Implementation for PDF export
    // This would typically use a library like jsPDF or html2pdf
    throw new Error('PDF export not implemented yet');
  }

  // Import resume from PDF format
  async importFromPDF(file) {
    // Implementation for PDF import
    // This would typically use a PDF parsing library
    throw new Error('PDF import not implemented yet');
  }
}

export const resumeIntegrationService = new ResumeIntegrationService(); 