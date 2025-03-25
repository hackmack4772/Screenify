import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { storageService } from '../services/storageService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalResumes: 0,
    totalInterviews: 0,
    averageResumeScore: 0,
    averageInterviewScore: 0,
    recentActivity: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = storageService.getAnalytics();
    setAnalytics(data);
  };

  const chartData = {
    labels: ['Resumes', 'Interviews'],
    datasets: [
      {
        label: 'Average Scores',
        data: [analytics.averageResumeScore, analytics.averageInterviewScore],
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Resumes</h3>
          <p className="stat-value">{analytics.totalResumes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Interviews</h3>
          <p className="stat-value">{analytics.totalInterviews}</p>
        </div>
        <div className="stat-card">
          <h3>Average Resume Score</h3>
          <p className="stat-value">{analytics.averageResumeScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Average Interview Score</h3>
          <p className="stat-value">{analytics.averageInterviewScore}%</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Performance Overview</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {analytics.recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'resume' ? '📄' : '💬'}
              </div>
              <div className="activity-content">
                <h4>{activity.type === 'resume' ? 'Resume Uploaded' : 'Interview Completed'}</h4>
                <p>{format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}</p>
                {activity.score && (
                  <p className="activity-score">Score: {activity.score}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 