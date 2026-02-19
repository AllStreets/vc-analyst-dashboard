import { useState } from 'react'

export default function CompetitiveCard({ data, confidence }) {
  const [expandedCompetitor, setExpandedCompetitor] = useState(null)

  const competitors = data?.competitors || []
  const getThreatColor = (level) => {
    if (level >= 7) return 'bg-red-900'
    if (level >= 4) return 'bg-yellow-900'
    return 'bg-green-900'
  }

  return (
    <div className="card border-competitive hover-lift">
      <div className="card-header gradient-header-competitive flex items-center justify-between">
        <h2>Competitive Intelligence</h2>
        <span className="text-sm font-normal opacity-90">{confidence}</span>
      </div>
      <div className="card-content">
        <p className="text-gray-400 mb-4">{data?.differentiation || 'Market positioning analysis'}</p>

        <div className="space-y-3">
          {competitors.length > 0 ? (
            competitors.map((competitor, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedCompetitor(expandedCompetitor === idx ? null : idx)}
                className="p-3 bg-dark rounded-lg border border-gray-700 cursor-pointer hover:border-competitive"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{competitor.name}</h4>
                    <p className="text-sm text-gray-400">{competitor.positioning}</p>
                  </div>
                  <div className={`px-3 py-1 rounded ${getThreatColor(competitor.threatLevel)} text-white text-sm font-semibold`}>
                    {competitor.threatLevel}/10
                  </div>
                </div>
                {expandedCompetitor === idx && (
                  <p className="mt-2 text-sm text-gray-300">{competitor.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No competitor data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
