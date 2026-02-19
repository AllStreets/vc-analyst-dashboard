import CompetitiveCard from './CompetitiveCard'
import MarketCard from './MarketCard'
import FounderCard from './FounderCard'
import ThesisCard from './ThesisCard'

export default function Dashboard({ data }) {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CompetitiveCard data={data.competitive} confidence={data.metadata?.confidenceCompetitive} />
      <MarketCard data={data.market} confidence={data.metadata?.confidenceMarket} />
      <FounderCard data={data.founder} confidence={data.metadata?.confidenceFounder} />
      <ThesisCard data={data.thesis} />
    </div>
  )
}
