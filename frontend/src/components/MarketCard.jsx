import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const chartConfig = {
  margin: { top: 5, right: 30, left: 0, bottom: 5 },
  textColor: '#f1f5f9',
  gridColor: 'rgba(255,255,255,0.1)',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-lighter border border-gray-600 rounded p-2">
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: ${entry.value}M
          </p>
        ))}
      </div>
    )
  }
  return null
}

const GrowthTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-lighter border border-gray-600 rounded p-2">
        <p style={{ color: '#f1f5f9' }} className="text-xs font-semibold">
          Year: {payload[0].payload.year}
        </p>
        <p style={{ color: '#f59e0b' }} className="text-xs">
          Growth Index: {payload[0].value.toFixed(1)}
        </p>
      </div>
    )
  }
  return null
}

export default function MarketCard({ data, confidence }) {
  const segments = data?.segments || []

  // Generate 5-year growth projection using CAGR
  const generateGrowthProjection = () => {
    const cagr = parseFloat(data?.cagr) || 20
    const startYear = new Date().getFullYear()
    const projection = []

    for (let i = 0; i < 5; i++) {
      const growth = Math.pow(1 + cagr / 100, i) * 100
      projection.push({
        year: startYear + i,
        growth: parseFloat(growth.toFixed(1)),
      })
    }
    return projection
  }

  // Market sizing chart data
  const marketSizeData = [
    {
      name: 'Market Size',
      TAM: parseFloat(data?.tam) || 0,
      SAM: parseFloat(data?.sam) || 0,
      SOM: parseFloat(data?.som) || 0,
    },
  ]

  const growthData = generateGrowthProjection()

  return (
    <div className="card border-market hover-lift">
      <div className="card-header gradient-header-market flex items-center justify-between">
        <h2>Market Sizing</h2>
        <span className="text-sm font-normal opacity-90">{confidence}</span>
      </div>
      <div className="card-content space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">TAM</p>
            <p className="text-lg font-bold text-market">${data?.tam || 'N/A'}M</p>
          </div>
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">SAM</p>
            <p className="text-lg font-bold text-market">${data?.sam || 'N/A'}M</p>
          </div>
          <div className="bg-dark rounded-lg p-3 text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wide">SOM</p>
            <p className="text-lg font-bold text-market">${data?.som || 'N/A'}M</p>
          </div>
        </div>

        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Market CAGR</p>
          <p className="text-2xl font-bold text-market">{data?.cagr || 'N/A'}%</p>
        </div>

        {/* Market Sizing Bar Chart */}
        {(data?.tam || data?.sam || data?.som) && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Market Tier Breakdown</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={marketSizeData}
                margin={chartConfig.margin}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis dataKey="name" stroke={chartConfig.textColor} />
                <YAxis stroke={chartConfig.textColor} label={{ value: '$M', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: chartConfig.textColor }} />
                <Bar dataKey="TAM" fill="#f59e0b" name="TAM" />
                <Bar dataKey="SAM" fill="#d97706" name="SAM" />
                <Bar dataKey="SOM" fill="#b45309" name="SOM" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

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

        {/* Growth Projection Line Chart */}
        {growthData.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">5-Year Growth Projection</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={growthData}
                margin={chartConfig.margin}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis dataKey="year" stroke={chartConfig.textColor} />
                <YAxis stroke={chartConfig.textColor} label={{ value: 'Growth Index', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<GrowthTooltip />} />
                <Legend wrapperStyle={{ color: chartConfig.textColor }} />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Growth Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
