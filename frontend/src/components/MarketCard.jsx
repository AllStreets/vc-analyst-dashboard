export default function MarketCard({ data, confidence }) {
  const segments = data?.segments || []

  return (
    <div className="card border-market hover-lift">
      <div className="card-header gradient-header-market flex items-center justify-between">
        <h2>Market Sizing</h2>
        <span className="text-sm font-normal opacity-90">{confidence}</span>
      </div>
      <div className="card-content space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">TAM</p>
            <p className="text-lg font-bold text-market">{data?.tam || 'N/A'}</p>
          </div>
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">SAM</p>
            <p className="text-lg font-bold text-market">{data?.sam || 'N/A'}</p>
          </div>
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">SOM</p>
            <p className="text-lg font-bold text-market">{data?.som || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Market CAGR</p>
          <p className="text-2xl font-bold text-market">{data?.cagr || 'N/A'}</p>
        </div>

        {segments.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Target Segments</p>
            <div className="flex flex-wrap gap-2">
              {segments.map((segment, idx) => (
                <span key={idx} className="px-3 py-1 bg-market bg-opacity-20 text-market rounded-full text-sm">
                  {segment}
                </span>
              ))}
            </div>
          </div>
        )}

        {data?.growthTrajectory && (
          <p className="text-sm text-gray-300">{data.growthTrajectory}</p>
        )}
      </div>
    </div>
  )
}
