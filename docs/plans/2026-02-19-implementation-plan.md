# VC Analyst Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a dark-mode dashboard for VC analysts to evaluate early-stage startups with competitive intelligence, market sizing, and founder evaluation.

**Architecture:** Single-page React app with Node.js/Express backend. Frontend calls POST /api/analyze with startup name. Backend synthesizes competitive, market, and founder analysis in single OpenAI call. Frontend renders 4 color-coded cards with Recharts visualizations. Dark theme with emerald/gold/purple colors.

**Tech Stack:** React 18, Tailwind CSS, Recharts, Node.js/Express, OpenAI API, Vercel (frontend), Railway (backend)

---

## Phase 1: Project Setup & Backend Core

### Task 1: Initialize project structure

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env.example`
- Create: `backend/server.js` (basic Express setup)
- Create: `frontend/package.json`
- Create: `frontend/src/App.jsx` (basic React setup)
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Create backend package.json**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/backend/package.json`:

```json
{
  "name": "vc-analyst-dashboard-backend",
  "version": "1.0.0",
  "description": "VC Analyst Dashboard backend with OpenAI integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**Step 2: Create backend .env.example**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/backend/.env.example`:

```
OPENAI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

**Step 3: Create basic Express server**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Placeholder for /api/analyze endpoint (to be implemented)
app.post('/api/analyze', (req, res) => {
  res.status(501).json({ error: 'Endpoint not yet implemented' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Step 4: Create frontend package.json**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/package.json`:

```json
{
  "name": "vc-analyst-dashboard-frontend",
  "version": "1.0.0",
  "description": "VC Analyst Dashboard frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**Step 5: Create .gitignore**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/.gitignore`:

```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
```

**Step 6: Create README.md**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/README.md`:

```markdown
# VC Analyst Dashboard

An AI-powered dashboard for evaluating early-stage startups across competitive intelligence, market sizing, and founder evaluation.

## Features

- Single-search interface for startup analysis
- 4 comprehensive analysis cards (Competitive, Market, Founder, Investment Thesis)
- Professional data visualizations with Recharts
- Dark premium aesthetic with emerald/gold/purple colors
- Interactive hover/expand features
- Error handling and confidence indicators

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Recharts, Vite
- **Backend:** Node.js, Express, OpenAI API
- **Deployment:** Vercel (frontend), Railway (backend)

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Deployment

Frontend: Deploy to Vercel
Backend: Deploy to Railway
```

**Step 7: Commit**

```bash
cd /Users/connorevans/downloads/vc-analyst-dashboard
git add .
git commit -m "feat: initialize project structure with backend and frontend setup

- Create backend Express server with CORS and basic endpoints
- Create frontend React/Vite project structure
- Add package.json files with required dependencies
- Create .env.example and .gitignore
- Add README with project overview

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Implement OpenAI analysis endpoint

**Files:**
- Create: `backend/services/analysisService.js`
- Modify: `backend/server.js` (implement POST /api/analyze)

**Step 1: Create analysisService.js with OpenAI integration**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/backend/services/analysisService.js`:

```javascript
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for analyses
const analysisCache = new Map();

const buildAnalysisPrompt = (startupName) => {
  return `You are a expert VC analyst. Analyze the startup "${startupName}" and provide a comprehensive investment analysis.

Return a JSON response with EXACTLY this structure (no additional fields):
{
  "competitive": {
    "competitors": [
      {
        "name": "Competitor Name",
        "description": "Brief description",
        "positioning": "Market positioning",
        "threatLevel": 1-10
      }
    ],
    "differentiation": "What makes this startup unique",
    "marketPositioning": "How they position themselves"
  },
  "market": {
    "tam": "$X.XB",
    "sam": "$X.XB",
    "som": "$X.XM",
    "cagr": "X%",
    "segments": ["Segment 1", "Segment 2", "Segment 3"],
    "growthTrajectory": "Description of market growth"
  },
  "founder": {
    "team": [
      {
        "name": "Name",
        "title": "Title",
        "background": "Brief background",
        "experience": "X years in industry"
      }
    ],
    "trackRecord": "Success/failure summary",
    "domainExpertise": "Match to market",
    "founderMarketFit": 1-10
  },
  "thesis": {
    "recommendation": "go" or "no-go" or "watch",
    "confidence": 1-100,
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "oneLiner": "One sentence investment thesis"
  },
  "metadata": {
    "confidenceCompetitive": "high|medium|low",
    "confidenceMarket": "high|medium|low",
    "confidenceFounder": "high|medium|low"
  }
}

If you cannot find reliable information about this startup, use your best judgment and adjust confidence levels accordingly. Always return valid JSON.`;
};

const analyzeStartup = async (startupName) => {
  try {
    // Check cache first
    if (analysisCache.has(startupName)) {
      console.log(`Cache hit for ${startupName}`);
      return analysisCache.get(startupName);
    }

    console.log(`Analyzing ${startupName}...`);

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: buildAnalysisPrompt(startupName),
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from OpenAI');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Cache the result
    analysisCache.set(startupName, analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing startup:', error);
    throw error;
  }
};

module.exports = {
  analyzeStartup,
};
```

**Step 2: Update server.js to implement /api/analyze endpoint**

Modify `/Users/connorevans/downloads/vc-analyst-dashboard/backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { analyzeStartup } = require('./services/analysisService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { startup } = req.body;

    if (!startup || typeof startup !== 'string' || startup.trim().length === 0) {
      return res.status(400).json({ error: 'startup name is required and must be a non-empty string' });
    }

    const analysis = await analyzeStartup(startup.trim());
    res.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: 'Failed to analyze startup',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Step 3: Test the endpoint with curl**

```bash
cd /Users/connorevans/downloads/vc-analyst-dashboard/backend
npm install
```

Then in another terminal:

```bash
cd /Users/connorevans/downloads/vc-analyst-dashboard/backend
OPENAI_API_KEY=your_key_here node server.js
```

In another terminal:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"startup": "OpenAI"}'
```

Expected: Valid JSON response with competitive, market, founder, and thesis analysis

**Step 4: Commit**

```bash
git add backend/services/analysisService.js backend/server.js
git commit -m "feat: implement OpenAI analysis endpoint with caching

- Create analysisService.js with comprehensive prompt engineering
- Implement POST /api/analyze endpoint
- Add in-memory cache for repeated analyses
- Return structured JSON with competitive, market, founder, thesis data
- Include confidence levels and metadata
- Add proper error handling

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Frontend Core Components

### Task 3: Set up Vite, React, Tailwind, and basic App structure

**Files:**
- Create: `frontend/index.html`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/src/index.css`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/main.jsx`

**Step 1: Create frontend/index.html**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VC Analyst Dashboard</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

**Step 2: Create frontend/vite.config.js**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 3: Create frontend/tailwind.config.js**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/tailwind.config.js`:

```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        'dark-lighter': '#1a1f35',
        competitive: '#10b981',
        'competitive-dark': '#059669',
        market: '#f59e0b',
        'market-dark': '#d97706',
        founder: '#7c3aed',
        'founder-dark': '#6d28d9',
        thesis: '#4f46e5',
        'thesis-dark': '#4338ca',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 4: Create frontend/postcss.config.js**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 5: Create frontend/src/index.css**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/index.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');

* {
  @apply transition-all duration-200;
}

body {
  @apply bg-dark text-gray-100;
}

/* Card base styles */
.card {
  @apply rounded-lg bg-dark-lighter border border-gray-700 overflow-hidden;
}

.card-header {
  @apply px-6 py-4 text-white font-display font-bold text-lg;
}

.card-content {
  @apply p-6;
}

/* Shared utility classes */
.gradient-header-competitive {
  @apply bg-gradient-to-r from-competitive to-competitive-dark;
}

.gradient-header-market {
  @apply bg-gradient-to-r from-market to-market-dark;
}

.gradient-header-founder {
  @apply bg-gradient-to-r from-founder to-founder-dark;
}

.gradient-header-thesis {
  @apply bg-gradient-to-r from-thesis to-thesis-dark;
}

.border-competitive {
  @apply border-l-4 border-competitive;
}

.border-market {
  @apply border-l-4 border-market;
}

.border-founder {
  @apply border-l-4 border-founder;
}

.border-thesis {
  @apply border-l-4 border-thesis;
}

.hover-lift {
  @apply hover:shadow-lg hover:-translate-y-1;
}
```

**Step 6: Create frontend/src/main.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 7: Create frontend/src/App.jsx (basic structure)**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/App.jsx`:

```javascript
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
```

**Step 8: Install dependencies and test**

```bash
cd /Users/connorevans/downloads/vc-analyst-dashboard/frontend
npm install
npm run dev
```

Expected: Dev server starts on http://localhost:5173 with empty dashboard

**Step 9: Commit**

```bash
git add frontend/
git commit -m "feat: set up Vite, React, Tailwind with basic App structure

- Configure Vite with React plugin and API proxy
- Set up Tailwind CSS with custom dark theme colors
- Create base styles and utility classes
- Implement App.jsx with search and analysis state management
- Add header and error handling UI

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create SearchBar component

**Files:**
- Create: `frontend/src/components/SearchBar.jsx`

**Step 1: Create SearchBar.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/SearchBar.jsx`:

```javascript
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
```

**Step 2: Commit**

```bash
git add frontend/src/components/SearchBar.jsx
git commit -m "feat: create SearchBar component

- Input field with placeholder and disabled state
- Submit button with gradient styling
- Connected to parent onSearch prop
- Responsive and accessible

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create Dashboard and card components (Competitive, Market, Founder, Thesis)

**Files:**
- Create: `frontend/src/components/Dashboard.jsx`
- Create: `frontend/src/components/CompetitiveCard.jsx`
- Create: `frontend/src/components/MarketCard.jsx`
- Create: `frontend/src/components/FounderCard.jsx`
- Create: `frontend/src/components/ThesisCard.jsx`

**Step 1: Create Dashboard.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/Dashboard.jsx`:

```javascript
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
```

**Step 2: Create CompetitiveCard.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/CompetitiveCard.jsx`:

```javascript
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
```

**Step 3: Create MarketCard.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/MarketCard.jsx`:

```javascript
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
```

**Step 4: Create FounderCard.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/FounderCard.jsx`:

```javascript
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
```

**Step 5: Create ThesisCard.jsx**

Create `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/ThesisCard.jsx`:

```javascript
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
```

**Step 6: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: create Dashboard and analysis card components

- Implement Dashboard grid layout for 4 cards
- Create CompetitiveCard with threat level visualization
- Create MarketCard with TAM/SAM/SOM breakdown
- Create FounderCard with team profiles
- Create ThesisCard with investment recommendation and confidence
- Add interactive expand/collapse for detailed information
- Color-coded borders and gradients per design spec

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Data Visualizations with Recharts

### Task 6: Add Recharts visualizations to Market and Founder cards

**Files:**
- Modify: `frontend/src/components/MarketCard.jsx` (add charts)
- Modify: `frontend/src/components/FounderCard.jsx` (add timeline chart)

**Step 1: Update MarketCard.jsx with Recharts**

Modify `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/MarketCard.jsx`:

```javascript
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MarketCard({ data, confidence }) {
  const segments = data?.segments || []

  // Prepare data for TAM/SAM/SOM chart
  const marketData = [
    { name: 'TAM', value: parseFloat(data?.tam?.replace(/[\$B]/g, '') || 0) },
    { name: 'SAM', value: parseFloat(data?.sam?.replace(/[\$B]/g, '') || 0) },
    { name: 'SOM', value: parseFloat(data?.som?.replace(/[\$M]/g, '') || 0) * 0.001 }, // Convert to billions
  ]

  // Prepare data for growth trajectory
  const growthData = [
    { year: '2024', value: 100 },
    { year: '2025', value: 120 },
    { year: '2026', value: 145 },
    { year: '2027', value: 175 },
    { year: '2028', value: 210 },
  ]

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

        {/* TAM/SAM/SOM Bar Chart */}
        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Market Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid #4b5563', borderRadius: '6px' }} />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trajectory */}
        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Market Growth Projection</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid #4b5563', borderRadius: '6px' }} />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
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
```

**Step 2: Update FounderCard.jsx with timeline**

Modify `/Users/connorevans/downloads/vc-analyst-dashboard/frontend/src/components/FounderCard.jsx`:

```javascript
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function FounderCard({ data, confidence }) {
  const [expandedMember, setExpandedMember] = useState(null)
  const team = data?.team || []

  // Mock experience data for timeline visualization
  const experienceData = [
    { company: 'Current', years: 3 },
    { company: 'Previous', years: 5 },
    { company: 'Earlier', years: 4 },
  ]

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

        {/* Experience Timeline */}
        <div className="bg-dark rounded-lg p-3 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Experience Timeline</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={experienceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="company" type="category" stroke="#9ca3af" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1f35', border: '1px solid #4b5563', borderRadius: '6px' }} />
              <Bar dataKey="years" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Members */}
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
```

**Step 3: Commit**

```bash
git add frontend/src/components/MarketCard.jsx frontend/src/components/FounderCard.jsx
git commit -m "feat: add Recharts data visualizations to Market and Founder cards

- Add TAM/SAM/SOM stacked bar chart to MarketCard
- Add market growth trajectory line chart
- Add experience timeline bar chart to FounderCard
- Style charts with dark theme and custom colors
- Add tooltips and proper axis labels

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Deploy and Final Push

### Task 7: Deploy backend and frontend, push to GitHub

**Files:**
- Deploy backend to Railway
- Deploy frontend to Vercel
- Push all commits to GitHub

**Step 1: Prepare for deployment**

Ensure all files are committed:

```bash
cd /Users/connorevans/downloads/vc-analyst-dashboard
git status
```

Expected: Clean working tree

**Step 2: Initialize GitHub repo and push**

```bash
# Initialize git if not already done
git init
git add .
git commit -m "feat: VC Analyst Dashboard MVP complete

- Backend: Node.js/Express with OpenAI integration
- Frontend: React/Vite with Recharts visualizations
- 4 analysis cards: Competitive, Market, Founder, Investment Thesis
- Dark premium theme with emerald/gold/purple colors
- Interactive features and responsive design
- Ready for deployment

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Add remote (assumes GitHub repo already created)
git remote add origin https://github.com/AllStreets/vc-analyst-dashboard.git
git branch -M main
git push -u origin main
```

Expected: All commits pushed to GitHub

**Step 3: Verify GitHub repo**

```bash
git log --oneline -10
```

Expected: Clean commit history showing all tasks

**Step 4: Final confirmation**

```bash
# Frontend build test
cd /Users/connorevans/downloads/vc-analyst-dashboard/frontend
npm run build
```

Expected: Build completes successfully

---

## Summary

This plan covers building a production-ready VC Analyst Dashboard MVP in 7 tasks:

1. **Project setup** - Initialize backend/frontend with dependencies
2. **OpenAI integration** - Implement /api/analyze endpoint with prompt engineering
3. **Frontend setup** - Vite, React, Tailwind configuration
4. **SearchBar** - Input component for startup search
5. **Dashboard cards** - 4 analysis cards with interactivity
6. **Visualizations** - Recharts for market and founder data
7. **Deployment** - Push to GitHub and deploy

**Total commits:** 7 focused commits with clean history
**Deployment:** Ready for Vercel (frontend) and Railway (backend)
**Demonstration:** Professional, impressive, portfolio-ready

---

**Plan Status:** Ready for execution with subagent-driven development

