import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { resumeBuilderService } from '../services/resumeBuilderService';
import { toast } from 'react-toastify';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resume, setResume] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [customization, setCustomization] = useState({
    font: '',
    colors: {
      primary: '',
      secondary: '',
      background: '',
      text: ''
    }
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templates = await resumeBuilderService.getTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load resume templates');
    }
  };

  const selectTemplate = async (templateId) => {
    try {
      const template = await resumeBuilderService.getTemplateById(templateId);
      const newResume = await resumeBuilderService.createNewResume(templateId);
      setSelectedTemplate(template);
      setResume(newResume);
      setCustomization({
        font: template.defaultFont,
        colors: template.defaultColors
      });
      toast.success('Template selected successfully');
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to select template');
    }
  };

  const updateSection = (sectionId, data) => {
    setResume(prev => ({
      ...prev,
      [sectionId]: data
    }));
  };

  const toggleSection = (sectionId) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    }));
  };

  const reorderSections = (result) => {
    if (!result.destination) return;

    const sections = Array.from(resume.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    setResume(prev => ({
      ...prev,
      sections
    }));
  };

  const handleDragEnd = (result) => {
    if (result.type === 'section') {
      reorderSections(result);
    }
  };

  const analyzeResume = async () => {
    try {
      const analysis = await resumeBuilderService.analyzeResume(resume);
      setSuggestions(analysis);
      setShowSuggestions(true);
      toast.success('Resume analysis complete');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume');
    }
  };

  const exportResume = async (format) => {
    try {
      const result = await resumeBuilderService.exportResume(resume, format);
      if (result.success) {
        // Handle successful export (e.g., download file)
        toast.success(`Resume exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Error exporting resume:', error);
      toast.error('Failed to export resume');
    }
  };

  const renderTemplateSelection = () => (
    <div className="template-selection">
      <h2>Choose a Resume Template</h2>
      <div className="template-grid">
        {Object.entries(templates).map(([id, template]) => (
          <div
            key={id}
            className="template-card"
            onClick={() => selectTemplate(id)}
          >
            <h3>{template.name}</h3>
            <div className="template-preview">
              {/* Add template preview image here */}
            </div>
            <div className="template-sections">
              {template.sections.map(section => (
                <span key={section.id} className="section-tag">
                  {section.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResumeEditor = () => (
    <div className="resume-editor">
      <div className="editor-sidebar">
        <h3>Sections</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections" type="section">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="section-list"
              >
                {resume.sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`section-item ${
                          activeSection === section.id ? 'active' : ''
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={() => toggleSection(section.id)}
                        />
                        <span>{section.title}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="editor-controls">
          <button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button onClick={analyzeResume}>Get AI Suggestions</button>
          <div className="export-options">
            <button onClick={() => exportResume('pdf')}>Export as PDF</button>
            <button onClick={() => exportResume('docx')}>Export as DOCX</button>
          </div>
        </div>
      </div>

      <div className="editor-main">
        {showPreview ? (
          <div className="resume-preview">
            {/* Render resume preview */}
          </div>
        ) : (
          <div className="section-editor">
            {activeSection && (
              <div className="section-form">
                {/* Render section-specific form */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="suggestions-panel">
      <h3>AI Suggestions</h3>
      <div className="suggestions-content">
        {suggestions && (
          <>
            <div className="suggestion-section">
              <h4>Content Completeness</h4>
              <p>{suggestions.completeness}% complete</p>
            </div>
            <div className="suggestion-section">
              <h4>Missing Sections</h4>
              <ul>
                {suggestions.missingSections.map((section, index) => (
                  <li key={index}>{section}</li>
                ))}
              </ul>
            </div>
            <div className="suggestion-section">
              <h4>Recommendations</h4>
              <ul>
                {suggestions.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            {/* Add more suggestion sections */}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="resume-builder">
      {!selectedTemplate ? (
        renderTemplateSelection()
      ) : (
        <>
          {renderResumeEditor()}
          {showSuggestions && renderSuggestions()}
        </>
      )}
    </div>
  );
};

export default ResumeBuilder; 