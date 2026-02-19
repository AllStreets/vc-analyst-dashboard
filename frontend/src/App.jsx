import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Dashboard from './components/Dashboard'

export default function App() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (startupName) => {
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup: startupName }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze startup')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-dark-lighter border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            VC Analyst Dashboard
          </h1>
          <p className="text-gray-400">
            Evaluate early-stage startups with AI-powered analysis
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} disabled={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 p-8 text-center">
            <div className="inline-block">
              <div className="animate-spin h-12 w-12 border-4 border-gray-600 border-t-competitive rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-400">Analyzing startup...</p>
          </div>
        )}

        {analysis && <Dashboard data={analysis} />}
      </main>
    </div>
  )
}
