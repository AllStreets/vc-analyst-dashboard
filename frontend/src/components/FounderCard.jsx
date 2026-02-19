import { useState } from 'react'

export default function FounderCard({ data, confidence }) {
  const [expandedMember, setExpandedMember] = useState(null)
  const team = data?.team || []

  return (
    <div className="card border-founder hover-lift">
      <div className="card-header gradient-header-founder flex items-center justify-between">
        <h2>Founder Evaluation</h2>
        <span className="text-sm font-normal opacity-90">{confidence}</span>
      </div>
      <div className="card-content space-y-4">
        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Founder-Market Fit</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-dark rounded-full h-2 border border-gray-600">
              <div
                className="h-full bg-gradient-to-r from-founder to-founder-dark rounded-full"
                style={{ width: `${(data?.founderMarketFit || 0) * 10}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-founder w-8">{data?.founderMarketFit || 0}/10</span>
          </div>
        </div>

        <div className="space-y-2">
          {team.length > 0 ? (
            team.map((member, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedMember(expandedMember === idx ? null : idx)}
                className="p-3 bg-dark rounded-lg border border-gray-700 cursor-pointer hover:border-founder"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-sm text-founder font-semibold">{member.title}</p>
                  </div>
                </div>
                {expandedMember === idx && (
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <p className="text-sm text-gray-300 mb-1">{member.background}</p>
                    <p className="text-xs text-gray-400">{member.experience}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No founder data available</p>
          )}
        </div>

        {data?.trackRecord && (
          <div className="bg-dark rounded-lg p-3 border border-gray-700 mt-3">
            <p className="text-sm text-gray-300">{data.trackRecord}</p>
          </div>
        )}

        {data?.domainExpertise && (
          <p className="text-sm text-gray-400 italic">{data.domainExpertise}</p>
        )}
      </div>
    </div>
  )
}
