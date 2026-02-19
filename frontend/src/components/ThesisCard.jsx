export default function ThesisCard({ data }) {
  const recommendation = data?.recommendation?.toLowerCase() || 'watch'
  const getRecommendationColor = () => {
    if (recommendation === 'go') return 'bg-green-900 border-green-700'
    if (recommendation === 'no-go') return 'bg-red-900 border-red-700'
    return 'bg-yellow-900 border-yellow-700'
  }

  const getRecommendationText = () => {
    if (recommendation === 'go') return 'GO'
    if (recommendation === 'no-go') return 'NO-GO'
    return 'WATCH'
  }

  return (
    <div className="card border-thesis hover-lift lg:col-span-2">
      <div className="card-header gradient-header-thesis">
        <h2>Investment Thesis</h2>
      </div>
      <div className="card-content space-y-4">
        <div className="flex items-center gap-4">
          <div className={`px-6 py-3 rounded-lg border font-bold text-white ${getRecommendationColor()}`}>
            {getRecommendationText()}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Confidence Score</p>
            <p className="text-3xl font-bold text-thesis">{data?.confidence || 0}%</p>
          </div>
        </div>

        {data?.oneLiner && (
          <div className="bg-dark rounded-lg p-4 border-l-4 border-thesis">
            <p className="text-lg text-gray-100">{data.oneLiner}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-thesis mb-2">✓ Investment Highlights</h4>
            <ul className="space-y-2">
              {data?.highlights?.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-thesis flex-shrink-0">→</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-2">⚠ Key Risks</h4>
            <ul className="space-y-2">
              {data?.risks?.map((risk, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-red-400 flex-shrink-0">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
