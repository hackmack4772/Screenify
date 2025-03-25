import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

const Navigation = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          Resume Screener
        </Link>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/upload" 
          className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
        >
          Upload Resume
        </Link>
        <Link 
          to="/analysis" 
          className={`nav-link ${isActive('/analysis') ? 'active' : ''}`}
        >
          Resume Analysis
        </Link>
        <Link 
          to="/interview" 
          className={`nav-link ${isActive('/interview') ? 'active' : ''}`}
        >
          AI Interview
        </Link>
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
      </div>

      <div className="nav-mobile">
        <button className="mobile-menu-btn">
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>
        <div className="mobile-menu">
          <Link 
            to="/upload" 
            className={`mobile-link ${isActive('/upload') ? 'active' : ''}`}
          >
            Upload Resume
          </Link>
          <Link 
            to="/analysis" 
            className={`mobile-link ${isActive('/analysis') ? 'active' : ''}`}
          >
            Resume Analysis
          </Link>
          <Link 
            to="/interview" 
            className={`mobile-link ${isActive('/interview') ? 'active' : ''}`}
          >
            AI Interview
          </Link>
          <Link 
            to="/dashboard" 
            className={`mobile-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/about" 
            className={`mobile-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 