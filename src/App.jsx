import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

function App() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analysis')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showTab = (tabName) => {
    setActiveTab(tabName)
  }

  const renderAnalysis = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading analysis...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-message">
          Error loading data: {error}. Please try again.
        </div>
      )
    }

    if (!data?.analysis) {
      return <p>No analysis data available.</p>
    }

    // If we have HTML from markdown parsing, use it
    if (data.analysis.html) {
      return (
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: data.analysis.html }}
        />
      )
    }

    // Fallback to structured rendering
    return (
      <>
        {data.analysis.summary && (
          <div className="summary">
            <h3>Key Takeaways</h3>
            <div>{data.analysis.summary}</div>
          </div>
        )}

        {data.analysis.categories && Object.entries(data.analysis.categories).map(([category, articles]) => (
          <div key={category} className="section">
            <h3>{category}</h3>
            {articles.map((article, index) => (
              <div key={index} className="article">
                <h4>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h4>
                {article.description && (
                  <div className="description">{article.description}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </>
    )
  }

  const renderRawData = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading raw data...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-message">
          Error loading data: {error}. Please try again.
        </div>
      )
    }

    if (!data?.rawData) {
      return <p>No raw data available.</p>
    }

    return (
      <div className="section">
        <h3>Raw Feed Data</h3>
        <pre style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          overflowX: 'auto',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {JSON.stringify(data.rawData, null, 2)}
        </pre>
      </div>
    )
  }

  const renderStats = () => {
    if (!data?.stats) {
      return <p>No statistics available.</p>
    }

    return (
      <div className="stats">
        <div className="stat-card">
          <h3>{data.stats.totalFeeds || 0}</h3>
          <p>Total Feeds</p>
        </div>
        <div className="stat-card">
          <h3>{data.stats.successfulFeeds || 0}</h3>
          <p>Successful</p>
        </div>
        <div className="stat-card">
          <h3>{data.stats.totalArticles || 0}</h3>
          <p>Articles Found</p>
        </div>
        <div className="stat-card">
          <h3>{data.stats.categories || 0}</h3>
          <p>Categories</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>RSS Feed Analysis</h1>
        <p>AI-powered insights from multiple news sources</p>
      </div>

      <div className="content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => showTab('analysis')}
          >
            Analysis
          </button>
          <button
            className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => showTab('raw')}
          >
            Raw Data
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => showTab('stats')}
          >
            Statistics
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'analysis' ? 'active' : ''}`}>
          {renderAnalysis()}
        </div>

        <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
          {renderRawData()}
        </div>

        <div className={`tab-content ${activeTab === 'stats' ? 'active' : ''}`}>
          {renderStats()}
        </div>
      </div>
    </div>
  )
}

export default App