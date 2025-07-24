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
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="has-text-grey">Loading analysis...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="notification is-danger error-notification">
          Error loading data: {error}. Please try again.
        </div>
      )
    }

    if (!data?.analysis) {
      return <p className="has-text-grey">No analysis data available.</p>
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
          <div className="card summary-card">
            <div className="card-content">
              <h3 className="title is-4 has-text-info">Key Takeaways</h3>
              <div className="content">{data.analysis.summary}</div>
            </div>
          </div>
        )}

        {data.analysis.categories && Object.entries(data.analysis.categories).map(([category, articles]) => (
          <div key={category} className="card">
            <div className="card-content">
              <h3 className="title is-4 has-text-primary">{category}</h3>
              {articles.map((article, index) => (
                <div key={index} className="card article-card">
                  <div className="card-content">
                    <h4 className="title is-5">
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="has-text-primary">
                        {article.title}
                      </a>
                    </h4>
                    {article.description && (
                      <div className="content has-text-grey">{article.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    )
  }

  const renderRawData = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="has-text-grey">Loading raw data...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="notification is-danger error-notification">
          Error loading data: {error}. Please try again.
        </div>
      )
    }

    if (!data?.rawData) {
      return <p className="has-text-grey">No raw data available.</p>
    }

    return (
      <div className="card">
        <div className="card-content">
          <h3 className="title is-4">Raw Feed Data</h3>
          <div className="raw-data-container">
            <pre>{JSON.stringify(data.rawData, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }

  const renderStats = () => {
    if (!data?.stats) {
      return <p className="has-text-grey">No statistics available.</p>
    }

    return (
      <div className="columns is-multiline">
        <div className="column is-3">
          <div className="stat-card">
            <p className="title">{data.stats.totalFeeds || 0}</p>
            <p className="subtitle">Total Feeds</p>
          </div>
        </div>
        <div className="column is-3">
          <div className="stat-card">
            <p className="title">{data.stats.successfulFeeds || 0}</p>
            <p className="subtitle">Successful</p>
          </div>
        </div>
        <div className="column is-3">
          <div className="stat-card">
            <p className="title">{data.stats.totalArticles || 0}</p>
            <p className="subtitle">Articles Found</p>
          </div>
        </div>
        <div className="column is-3">
          <div className="stat-card">
            <p className="title">{data.stats.categories || 0}</p>
            <p className="subtitle">Categories</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-1 has-text-white">RSS Feed Analysis</h1>
            <p className="subtitle is-4 has-text-white">AI-powered insights from multiple news sources</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="card">
          <div className="card-content">
            <div className="tabs is-boxed">
              <ul>
                <li className={activeTab === 'analysis' ? 'is-active' : ''}>
                  <a onClick={() => showTab('analysis')}>
                    <span className="icon is-small">
                      <i className="fas fa-chart-line"></i>
                    </span>
                    <span>Analysis</span>
                  </a>
                </li>
                <li className={activeTab === 'raw' ? 'is-active' : ''}>
                  <a onClick={() => showTab('raw')}>
                    <span className="icon is-small">
                      <i className="fas fa-code"></i>
                    </span>
                    <span>Raw Data</span>
                  </a>
                </li>
                <li className={activeTab === 'stats' ? 'is-active' : ''}>
                  <a onClick={() => showTab('stats')}>
                    <span className="icon is-small">
                      <i className="fas fa-chart-bar"></i>
                    </span>
                    <span>Statistics</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-5">
              {activeTab === 'analysis' && renderAnalysis()}
              {activeTab === 'raw' && renderRawData()}
              {activeTab === 'stats' && renderStats()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App