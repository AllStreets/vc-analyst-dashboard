import { useState } from 'react'

export default function SearchBar({ onSearch, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter startup name (e.g., OpenAI, Anthropic, Stripe)"
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-competitive disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-competitive to-competitive-dark text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 hover-lift"
        >
          Analyze
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Search for any startup to analyze competitive landscape, market size, and founder fit
      </p>
    </form>
  )
}
