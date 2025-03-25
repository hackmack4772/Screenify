import React, { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { toast } from 'react-toastify'
import { resumeService } from '../services/resumeService'
import { storageService } from '../services/storageService'
import '../styles/ResumeUpload.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ResumeUpload = () => {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsedData, setParsedData] = useState(null)
  const fileInputRef = useRef(null)
  const uploadAreaRef = useRef(null)
  const pdfViewerRef = useRef(null)
  const searchInputRef = useRef(null)

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.includes('pdf')) {
      toast.error('Please upload a PDF file')
      return
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    setFile(selectedFile)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Parse resume
      const result = await resumeService.parseResume(selectedFile)
      setParsedData(result.parsedData)

      // Save to storage
      storageService.saveResume({
        file: selectedFile,
        parsedData: result.parsedData,
        analysis: result.analysis,
        score: calculateResumeScore(result.parsedData)
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      toast.success('Resume uploaded and analyzed successfully!')
    } catch (error) {
      console.error('Error processing resume:', error)
      toast.error(error.message || 'Failed to process resume')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const calculateResumeScore = (data) => {
    let score = 0
    const weights = {
      skills: 0.3,
      experience: 0.4,
      education: 0.3
    }

    // Score based on skills
    if (data.skills && data.skills.length > 0) {
      score += weights.skills * 100
    }

    // Score based on experience
    if (data.experience && data.experience.length > 0) {
      score += weights.experience * 100
    }

    // Score based on education
    if (data.education && data.education.length > 0) {
      score += weights.education * 100
    }

    return Math.round(score)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      const fakeEvent = { target: { files: [droppedFile] } }
      handleFileChange(fakeEvent)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const clearFile = () => {
    setFile(null)
    setNumPages(null)
    setPageNumber(1)
    setScale(1)
    setRotation(0)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const fitToWidth = () => {
    const container = document.querySelector('.pdf-viewer-container')
    if (container) {
      const containerWidth = container.clientWidth
      const pageWidth = 595 // Standard PDF page width in points
      const newScale = containerWidth / pageWidth
      setScale(newScale)
    }
  }

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleThumbnails = () => {
    setShowThumbnails(prev => !prev)
  }

  const handleSearch = () => {
    if (!searchText.trim()) return

    const results = []
    const text = parsedData?.rawText || ''
    let match
    const regex = new RegExp(searchText, 'gi')

    while ((match = regex.exec(text)) !== null) {
      results.push({
        text: match[0],
        index: match.index,
        page: Math.floor(match.index / 1000) + 1 // Rough page estimation
      })
    }

    setSearchResults(results)
    setCurrentSearchIndex(results.length > 0 ? 0 : -1)
  }

  const navigateSearchResult = (direction) => {
    if (searchResults.length === 0) return

    setCurrentSearchIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev + 1) % searchResults.length
        : (prev - 1 + searchResults.length) % searchResults.length
      return newIndex
    })
  }

  return (
    <div className="resume-upload-container">
      <div className="upload-section">
        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <p>Drag and drop your resume here or click to browse</p>
            <p className="file-types">Supported format: PDF</p>
            <p className="file-size">Maximum size: 5MB</p>
          </div>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p>{uploadProgress}%</p>
          </div>
        )}
      </div>

      {file && (
        <div className="preview-section">
          <div className="preview-header">
            <h2>Resume Preview</h2>
            <button className="clear-btn" onClick={clearFile}>
              Clear
            </button>
          </div>

          <div className="pdf-controls">
            <button
              className="control-btn"
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              className="control-btn"
              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
            <button className="control-btn" onClick={fitToWidth}>
              Fit
            </button>
            <button className="control-btn" onClick={rotate}>
              Rotate
            </button>
            <button className="control-btn" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button className="control-btn" onClick={toggleThumbnails}>
              {showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}
            </button>
          </div>

          <div className="search-controls">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search in PDF..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="control-btn"
              onClick={handleSearch}
              disabled={!searchText.trim()}
            >
              Search
            </button>
            {searchResults.length > 0 && (
              <>
                <button
                  className="control-btn"
                  onClick={() => navigateSearchResult('prev')}
                >
                  Previous Result
                </button>
                <span>
                  Result {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <button
                  className="control-btn"
                  onClick={() => navigateSearchResult('next')}
                >
                  Next Result
                </button>
              </>
            )}
          </div>

          <div className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
            {showThumbnails && (
              <div className="thumbnails-sidebar">
                {Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`thumbnail_${index + 1}`}
                    className={`thumbnail ${pageNumber === index + 1 ? 'active' : ''}`}
                    onClick={() => setPageNumber(index + 1)}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={150}
                      renderTextLayer={false}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pdf-viewer">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div>Loading PDF...</div>}
                error={<div>Failed to load PDF.</div>}
                options={{
                  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
                  cMapPacked: true
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          </div>

          {parsedData && (
            <div className="parsed-data">
              <h3>Parsed Information</h3>
              <div className="data-grid">
                <div className="data-item">
                  <h4>Name</h4>
                  <p>{parsedData.name}</p>
                </div>
                <div className="data-item">
                  <h4>Email</h4>
                  <p>{parsedData.email}</p>
                </div>
                <div className="data-item">
                  <h4>Phone</h4>
                  <p>{parsedData.phone}</p>
                </div>
                <div className="data-item">
                  <h4>Skills</h4>
                  <ul>
                    {parsedData.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="data-item">
                  <h4>Experience</h4>
                  <ul>
                    {parsedData.experience.map((exp, index) => (
                      <li key={index}>
                        <strong>{exp.title}</strong> at {exp.company}
                        <br />
                        {exp.period}
                        <br />
                        {exp.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="data-item">
                  <h4>Education</h4>
                  <ul>
                    {parsedData.education.map((edu, index) => (
                      <li key={index}>
                        <strong>{edu.degree}</strong> from {edu.institution}
                        <br />
                        {edu.period}
                        <br />
                        {edu.details}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ResumeUpload 