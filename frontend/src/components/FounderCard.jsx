import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const chartConfig = {
  margin: { top: 5, right: 30, left: 150, bottom: 5 },
  textColor: '#f1f5f9',
  gridColor: 'rgba(255,255,255,0.1)',
}

const ExperienceTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-lighter border border-gray-600 rounded p-2">
        <p style={{ color: '#f1f5f9' }} className="text-xs font-semibold">
          {payload[0].payload.name}
        </p>
        <p style={{ color: '#7c3aed' }} className="text-xs">
          Experience: {payload[0].value} years
        </p>
      </div>
    )
  }
  return null
}

export default function FounderCard({ data, confidence }) {
  const [expandedMember, setExpandedMember] = useState(null)
  const team = data?.team || []

  // Extract years of experience from team members
  const extractExperience = (member) => {
    // Try to parse from experience field first
    if (member.experience) {
      const match = member.experience.match(/(\d+)/)
      if (match) return parseInt(match[1])
    }
    // Try to estimate from background keywords
    if (member.background) {
      if (member.background.includes('decades')) return 20
      if (member.background.includes('20+ years')) return 20
      if (member.background.includes('15+ years')) return 15
      if (member.background.includes('10+ years')) return 10
      if (member.background.includes('experienced')) return 8
      if (member.background.includes('founder')) return 10
    }
    // Default based on title
    if (member.title?.includes('CEO') || member.title?.includes('Founder')) return 10
    if (member.title?.includes('CTO') || member.title?.includes('VP')) return 8
    return 5
  }

  // Build experience timeline data
  const experienceData = team.map((member) => ({
    name: `${member.name.split(' ')[0]} (${member.title?.split(' ')[0] || 'Team'})`,
    experience: extractExperience(member),
  }))

  return (
    <div className="card border-founder hover-lift">
      <div className="card-header gradient-header-founder flex items-center justify-between">
        <h2>Founder Evaluation</h2>
        <span className="text-sm font-normal opacity-90">{confidence}</span>
      </div>
      <div className="card-content space-y-6">
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

        {/* Experience Timeline Chart */}
        {experienceData.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Experience Timeline</p>
            <ResponsiveContainer width="100%" height={Math.max(200, experienceData.length * 50)}>
              <BarChart
                data={experienceData}
                layout="vertical"
                margin={chartConfig.margin}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis type="number" stroke={chartConfig.textColor} label={{ value: 'Years', angle: 0, position: 'insideBottomRight', offset: -5 }} />
                <YAxis type="category" dataKey="name" stroke={chartConfig.textColor} width={140} />
                <Tooltip content={<ExperienceTooltip />} />
                <Legend wrapperStyle={{ color: chartConfig.textColor }} />
                <Bar dataKey="experience" fill="#7c3aed" name="Years of Experience" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-2">
          {team.length > 0 ? (
            team.map((member, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedMember(expandedMember === idx ? null : idx)}
                className="p-3 bg-dark rounded-lg border border-gray-700 cursor-pointer hover:border-founder transition-colors"
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
                    {member.experience && <p className="text-xs text-gray-400">{member.experience}</p>}
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
